#!/usr/bin/env node
// Idempotent Appwrite provisioning for the Expedition site.
//
// Creates (or, on re-run, verifies) the database, tables, columns, indexes,
// the Admins team, and the uploads bucket described in schema.mjs. Safe to
// run repeatedly: every step checks for an existing resource first and
// skips it rather than failing, so this can run on every push to the
// schema files without manual bookkeeping.
//
// Uses Appwrite's TablesDB API (the Databases/Collections/Attributes API it
// replaces is deprecated as of Appwrite 1.8).
//
// Required environment variables:
//   APPWRITE_ENDPOINT    e.g. https://cloud.appwrite.io/v1
//   APPWRITE_PROJECT_ID  the Appwrite project to provision into
//   APPWRITE_API_KEY     a server API key with scopes: databases.write,
//                         collections.write, attributes.write, indexes.write,
//                         teams.write, buckets.write
// Optional:
//   APPWRITE_ADMIN_EMAILS  comma-separated emails to invite into the Admins
//                           team via Appwrite's built-in invite email.

import { Client, TablesDB, Teams, Storage, Permission, Role, TablesDBIndexType } from 'node-appwrite';
import {
  DATABASE_ID, DATABASE_NAME,
  ADMIN_TEAM_ID, ADMIN_TEAM_NAME,
  UPLOADS_BUCKET_ID, UPLOADS_BUCKET_NAME,
  collections as tableDefs,
} from './schema.mjs';

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
};

const endpoint = required('APPWRITE_ENDPOINT');
const projectId = required('APPWRITE_PROJECT_ID');
const apiKey = required('APPWRITE_API_KEY');
const adminEmails = (process.env.APPWRITE_ADMIN_EMAILS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const tablesDB = new TablesDB(client);
const teams = new Teams(client);
const storage = new Storage(client);

const isNotFound = (err) => err?.code === 404;
const isConflict = (err) => err?.code === 409;

const step = (label) => console.log(`\n▸ ${label}`);
const ok = (label) => console.log(`  ✓ ${label}`);
const skip = (label) => console.log(`  · ${label} (already exists)`);
const warn = (label) => console.log(`  ! ${label}`);

// Things this run could not apply because the live data has to change first
// (a column can't become required while rows hold nulls; a unique index
// can't be built while duplicates exist). Collected rather than thrown so a
// single blocked change doesn't abandon the rest of the provisioning, then
// printed as an actionable summary and reflected in the exit code.
const blocked = [];
const blockedBy = (what, why, fix) => blocked.push({ what, why, fix });

async function ensureDatabase() {
  step(`Database "${DATABASE_ID}"`);
  try {
    await tablesDB.get({ databaseId: DATABASE_ID });
    skip(DATABASE_ID);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    await tablesDB.create({ databaseId: DATABASE_ID, name: DATABASE_NAME });
    ok(`created database ${DATABASE_ID}`);
  }
}

async function ensureTable(def) {
  step(`Table "${def.id}"`);
  try {
    await tablesDB.getTable({ databaseId: DATABASE_ID, tableId: def.id });
    skip(def.id);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    await tablesDB.createTable({
      databaseId: DATABASE_ID,
      tableId: def.id,
      name: def.name,
      permissions: def.permissions,
      rowSecurity: false,
    });
    ok(`created table ${def.id}`);
  }
}

async function existingColumnKeys(tableId) {
  const res = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId });
  return new Set(res.columns.map((c) => c.key));
}

async function createColumn(tableId, attr) {
  const { type, key, required: isRequired, array, size, min, max, default: xdefault, elements } = attr;
  const base = { databaseId: DATABASE_ID, tableId, key, required: isRequired, array };
  switch (type) {
    case 'string':
      return tablesDB.createStringColumn({ ...base, size, xdefault });
    case 'email':
      return tablesDB.createEmailColumn({ ...base, xdefault });
    case 'integer':
      return tablesDB.createIntegerColumn({ ...base, min, max, xdefault });
    case 'float':
      return tablesDB.createFloatColumn({ ...base, min, max, xdefault });
    case 'boolean':
      return tablesDB.createBooleanColumn({ ...base, xdefault });
    case 'enum':
      return tablesDB.createEnumColumn({ ...base, elements, xdefault });
    default:
      throw new Error(`Unknown attribute type "${type}" for ${tableId}.${key}`);
  }
}

// Push a changed definition onto a column that already exists. Only the
// properties Appwrite lets you alter in place are sent; `key` and `type` are
// immutable, so a genuine type change still needs a manual migration.
function updateColumn(tableId, attr) {
  const { type, key, required: isRequired, size, min, max, elements } = attr;
  // Every update*Column method treats `xdefault` as a mandatory argument and
  // throws on `undefined`, so an attribute with no default has to send an
  // explicit null. Appwrite also forbids a non-null default on a required
  // column, which is exactly what null expresses here.
  const xdefault = attr.default ?? null;
  const base = { databaseId: DATABASE_ID, tableId, key, required: isRequired, xdefault };
  switch (type) {
    case 'string':
      return tablesDB.updateStringColumn({ ...base, size });
    case 'email':
      return tablesDB.updateEmailColumn(base);
    case 'integer':
      return tablesDB.updateIntegerColumn({ ...base, min, max });
    case 'float':
      return tablesDB.updateFloatColumn({ ...base, min, max });
    case 'boolean':
      return tablesDB.updateBooleanColumn(base);
    case 'enum':
      return tablesDB.updateEnumColumn({ ...base, elements });
    default:
      throw new Error(`Unknown attribute type "${type}" for ${tableId}.${key}`);
  }
}

async function ensureColumns(def) {
  step(`Columns for "${def.id}"`);
  const res = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId: def.id });
  const existing = new Map(res.columns.map((c) => [c.key, c]));

  for (const attr of def.attributes) {
    const column = existing.get(attr.key);
    if (!column) {
      await createColumn(def.id, attr);
      ok(`created column ${attr.key}`);
      continue;
    }

    // Reconcile columns that already exist. This used to be create-only,
    // which silently ignored schema.mjs changes to an existing column — a
    // field marked required here stayed optional on the live project
    // forever, with no output to say so.
    const wantRequired = !!attr.required;
    const requiredChanged = !!column.required !== wantRequired;
    // Appwrite reports string sizes; only ever grow one, since shrinking
    // would truncate stored values.
    const sizeChanged = attr.type === 'string'
      && typeof attr.size === 'number'
      && typeof column.size === 'number'
      && attr.size > column.size;

    if (!requiredChanged && !sizeChanged) { skip(attr.key); continue; }

    const changes = [
      requiredChanged ? `required ${column.required} → ${wantRequired}` : null,
      sizeChanged ? `size ${column.size} → ${attr.size}` : null,
    ].filter(Boolean).join(', ');

    try {
      await updateColumn(def.id, attr);
      ok(`updated column ${attr.key} (${changes})`);
    } catch (err) {
      // The usual cause is existing rows that don't satisfy the new rule —
      // most often nulls in a column being promoted to required.
      warn(`could not update column ${attr.key} (${changes}): ${err?.message || err}`);
      blockedBy(
        `${def.id}.${attr.key} — ${changes}`,
        err?.message || String(err),
        requiredChanged && wantRequired
          ? `Existing rows probably hold empty values for "${attr.key}". Fill them in (or clear those rows) in the Appwrite console, then re-run this workflow.`
          : `Adjust the conflicting data in the Appwrite console, then re-run this workflow.`,
      );
    }
  }
}

// Unlike ensureColumns (create-only), this keeps an existing enum column's
// allowed values in sync with schema.mjs — needed when an option is removed
// from a form (e.g. timeCommitment dropping "I need to discuss my
// schedule"). Historical rows that already used a removed value are left
// alone; only the column's own allow-list changes.
async function ensureEnumsUpToDate(def) {
  const enumAttrs = def.attributes.filter((attr) => attr.type === 'enum');
  if (!enumAttrs.length) return;
  await waitForColumnsReady(def.id);
  const res = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId: def.id });
  for (const attr of enumAttrs) {
    const column = res.columns.find((c) => c.key === attr.key);
    if (!column) continue;
    const currentElements = column.elements || [];
    const sameElements = currentElements.length === attr.elements.length
      && attr.elements.every((el) => currentElements.includes(el));
    if (sameElements) { skip(`${attr.key} (elements unchanged)`); continue; }
    try {
      await tablesDB.updateEnumColumn({
        databaseId: DATABASE_ID,
        tableId: def.id,
        key: attr.key,
        elements: attr.elements,
        required: attr.required,
        // Like updateColumn() above: xdefault is a mandatory SDK parameter
        // that throws on undefined, so an attribute with no default needs
        // an explicit null rather than passing attr.default straight
        // through. This was the actual crash on the first provisioning run
        // after this pass — treatment (which has no default either) never
        // hit it because its live elements already matched, but
        // timeCommitment's elements had drifted (a legacy option removed
        // from the form) so this path finally ran and threw before
        // anything downstream — including the two new unique indexes —
        // got a chance to.
        xdefault: attr.default ?? null,
      });
      ok(`updated enum values for ${attr.key}`);
    } catch (err) {
      warn(`could not update enum values for ${attr.key}: ${err?.message || err}`);
      blockedBy(
        `${def.id}.${attr.key} — enum elements out of date`,
        err?.message || String(err),
        `Update the "${attr.key}" column's allowed values in the Appwrite console to match schema.mjs, then re-run this workflow.`,
      );
    }
  }
}

// Columns go through a brief "processing" phase server-side; indexes can't
// be created on columns that aren't "available" yet.
async function waitForColumnsReady(tableId, timeoutMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId });
    const pending = res.columns.filter((c) => c.status === 'processing');
    const failed = res.columns.filter((c) => c.status === 'failed' || c.status === 'stuck');
    if (failed.length) {
      throw new Error(`Column(s) failed on ${tableId}: ${failed.map((c) => c.key).join(', ')}`);
    }
    if (!pending.length) return;
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Timed out waiting for columns on ${tableId} to become available`);
}

async function existingIndexKeys(tableId) {
  const res = await tablesDB.listIndexes({ databaseId: DATABASE_ID, tableId });
  return new Set(res.indexes.map((i) => i.key));
}

async function ensureIndexes(def) {
  if (!def.indexes?.length) return;
  step(`Indexes for "${def.id}"`);
  await waitForColumnsReady(def.id);
  const existing = await existingIndexKeys(def.id);
  for (const idx of def.indexes) {
    if (existing.has(idx.key)) { skip(idx.key); continue; }
    try {
      await tablesDB.createIndex({
        databaseId: DATABASE_ID,
        tableId: def.id,
        key: idx.key,
        type: idx.type === 'key' ? TablesDBIndexType.Key
          : idx.type === 'unique' ? TablesDBIndexType.Unique
            : idx.type,
        columns: idx.attributes,
      });
      ok(`created index ${idx.key}`);
    } catch (err) {
      // A unique index cannot be built over a column that already contains
      // duplicates. Report which one and keep going, so the rest of the
      // schema still lands and the operator gets one complete list of what
      // needs cleaning up rather than discovering it one failed run at a time.
      warn(`could not create index ${idx.key}: ${err?.message || err}`);
      blockedBy(
        `${def.id} index ${idx.key} (${idx.type} on ${idx.attributes.join(', ')})`,
        err?.message || String(err),
        idx.type === 'unique'
          ? `Existing rows share a value in "${idx.attributes.join(', ')}". Remove or correct the duplicate rows in the Appwrite console, then re-run this workflow. Until this index exists, duplicate submissions are NOT blocked.`
          : `Resolve the reported conflict in the Appwrite console, then re-run this workflow.`,
      );
    }
  }
}

async function ensureAdminsTeam() {
  step(`Team "${ADMIN_TEAM_ID}"`);
  try {
    await teams.get({ teamId: ADMIN_TEAM_ID });
    skip(ADMIN_TEAM_ID);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    await teams.create({ teamId: ADMIN_TEAM_ID, name: ADMIN_TEAM_NAME });
    ok(`created team ${ADMIN_TEAM_ID}`);
  }

  for (const emailAddress of adminEmails) {
    try {
      // Called with a server API key, this adds the member directly rather
      // than emailing an invite — the user still needs an Appwrite Auth
      // account with this email to actually sign in afterwards. Membership
      // creation 409s only if the email is already a member, which we treat
      // as "already invited" and skip.
      await teams.createMembership({ teamId: ADMIN_TEAM_ID, roles: ['owner'], email: emailAddress });
      ok(`added ${emailAddress} to Admins`);
    } catch (err) {
      if (isConflict(err)) { skip(`membership for ${emailAddress}`); continue; }
      console.warn(`  ! could not add ${emailAddress}: ${err.message}`);
    }
  }
}

async function ensureUploadsBucket() {
  step(`Bucket "${UPLOADS_BUCKET_ID}"`);
  try {
    await storage.getBucket({ bucketId: UPLOADS_BUCKET_ID });
    skip(UPLOADS_BUCKET_ID);
  } catch (err) {
    if (!isNotFound(err)) throw err;
    await storage.createBucket({
      bucketId: UPLOADS_BUCKET_ID,
      name: UPLOADS_BUCKET_NAME,
      permissions: [
        // Applicants upload their own medical-report files from the public
        // form before ever signing in — mirrors the tables' "create(any)"
        // pattern. Reading, updating or deleting a file still requires
        // Admins-team membership.
        Permission.create(Role.any()),
        Permission.read(Role.team(ADMIN_TEAM_ID)),
        Permission.update(Role.team(ADMIN_TEAM_ID)),
        Permission.delete(Role.team(ADMIN_TEAM_ID)),
      ],
      fileSecurity: false, // table-level permissions above are enough
      enabled: true,
      maximumFileSize: 15 * 1024 * 1024, // 15MB
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    });
    ok(`created bucket ${UPLOADS_BUCKET_ID}`);
  }
}

async function main() {
  console.log(`Provisioning Appwrite project "${projectId}" at ${endpoint}`);
  await ensureDatabase();
  for (const def of tableDefs) {
    await ensureTable(def);
    await ensureColumns(def);
    await ensureEnumsUpToDate(def);
    await ensureIndexes(def);
  }
  await ensureAdminsTeam();
  await ensureUploadsBucket();

  if (blocked.length) {
    console.log(`\n${'='.repeat(72)}`);
    console.log(`ACTION NEEDED — ${blocked.length} change(s) could not be applied to the live data`);
    console.log('='.repeat(72));
    blocked.forEach(({ what, why, fix }, i) => {
      console.log(`\n${i + 1}. ${what}`);
      console.log(`   Appwrite said: ${why}`);
      console.log(`   To fix: ${fix}`);
    });
    console.log('\nEverything else was provisioned successfully. This run is marked failed'
      + ' so the outstanding items above are not missed.');
    // Non-zero so the workflow surfaces it; all achievable work is already done.
    process.exitCode = 1;
    return;
  }

  console.log('\nDone. The schema matches scripts/appwrite/schema.mjs.');
  console.log(`Add admin users via the Appwrite console (Auth → create user), then add them to the`
    + ` "${ADMIN_TEAM_ID}" team — or re-run this script with APPWRITE_ADMIN_EMAILS set to send invites.`);
}

main().catch((err) => {
  console.error('\nProvisioning failed:', err.message || err);
  process.exit(1);
});
