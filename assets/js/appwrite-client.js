// Shared Appwrite client used by the public forms (apply, nominate,
// partner) and the admin panel. Public forms only ever call submitForm()
// below, which can only create rows — the "read" permission on every table
// is restricted to the Admins team (see scripts/appwrite/schema.mjs), so a
// submitted application can't be read back by the person who submitted it,
// let alone by anyone else browsing the site.

// The Appwrite SDK is vendored as an IIFE build (see
// assets/vendor/appwrite/README.md) and must be loaded via a plain,
// blocking <script src="assets/vendor/appwrite/sdk.js"> BEFORE this module
// — classic scripts without async/defer run before deferred module scripts,
// so window.Appwrite is guaranteed to exist by the time this file executes.
if (!window.Appwrite) {
  throw new Error('assets/vendor/appwrite/sdk.js must be loaded before appwrite-client.js');
}
const {
  Client, TablesDB, Account, Teams, Storage, Query, ID,
} = window.Appwrite;
import {
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, DATABASE_ID, TABLES, ADMIN_TEAM_ID, UPLOADS_BUCKET_ID,
} from '../config/appwrite-config.js';

const isConfigured = APPWRITE_PROJECT_ID && APPWRITE_PROJECT_ID !== 'REPLACE_WITH_YOUR_APPWRITE_PROJECT_ID';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID || 'unconfigured');
const tablesDB = new TablesDB(client);
const account = new Account(client);
const teams = new Teams(client);
const storage = new Storage(client);

class SubmissionError extends Error {
  // Carries the backend's status code and error type through to callers so a
  // uniqueness conflict can be told apart from a generic failure and mapped
  // onto the right field. Without this the original code was lost and every
  // failure looked the same to the form.
  constructor(message, { code, type } = {}) {
    super(message);
    this.code = code;
    this.type = type;
  }
}

// Appwrite answers 409 both for "a row with this id already exists" (which the
// upsert path below handles by updating that row) and for "a unique index
// rejected this value" (a genuine duplicate that must surface to the user).
// Only the first is safe to retry as an update.
const isRowIdConflict = (err) => err?.code === 409
  && !/index|unique/i.test(String(err?.message || ''));

/**
 * Create a row in one of the public-facing tables (applications,
 * nominations, partnerships).
 *
 * @param {'applications'|'nominations'|'partnerships'} tableKey
 * @param {Record<string, unknown>} data - form fields, matching the table's columns
 * @param {{ honeypot?: string, rowId?: string }} [options] - honeypot is a decoy
 *   field name; if it has a value, this silently resolves without submitting
 *   (bot traffic). Passing `rowId` makes the call idempotent: create-or-update
 *   the same row instead of always creating a new one — used by the
 *   application form's review → edit → resubmit flow so re-submitting never
 *   creates a duplicate application.
 */
async function submitForm(tableKey, data, options = {}) {
  if (options.honeypot) {
    // Looks like a bot: pretend success without writing anything.
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return { $id: 'skipped' };
  }
  if (!isConfigured) {
    throw new SubmissionError(
      'This site is not yet connected to its backend. Please try again shortly, or contact nirogbhumi@gmail.com directly.',
    );
  }
  const tableId = TABLES[tableKey];
  if (!tableId) throw new SubmissionError(`Unknown form "${tableKey}"`);

  try {
    if (options.rowId) {
      // upsertRow creates the row on first submit and updates the same row
      // on every later resubmit (edit flow) — never a second row for one
      // rowId. Older Appwrite SDK builds may not expose upsertRow yet, so
      // fall back to create-then-update-on-conflict for compatibility.
      if (typeof tablesDB.upsertRow === 'function') {
        return await tablesDB.upsertRow({
          databaseId: DATABASE_ID, tableId, rowId: options.rowId, data,
        });
      }
      try {
        return await tablesDB.createRow({
          databaseId: DATABASE_ID, tableId, rowId: options.rowId, data,
        });
      } catch (err) {
        // Only an id collision means "this session's row already exists,
        // update it". A unique-index rejection must not be quietly turned
        // into an update of somebody else's row — rethrow so the caller can
        // report it as a duplicate.
        if (!isRowIdConflict(err)) throw err;
        return await tablesDB.updateRow({
          databaseId: DATABASE_ID, tableId, rowId: options.rowId, data,
        });
      }
    }
    return await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId,
      rowId: ID.unique(),
      data,
    });
  } catch (err) {
    console.error(`[appwrite] ${tableKey} submission failed`, err);
    throw new SubmissionError(
      err?.message || 'Something went wrong submitting this form. Please try again in a moment.',
      { code: err?.code, type: err?.type },
    );
  }
}

/**
 * Upload one file to the shared evidence/uploads bucket (public create-only —
 * see scripts/appwrite/provision.mjs; read/update/delete stay admin-only).
 * Returns the created file's id, or throws SubmissionError on failure.
 */
async function uploadFile(file) {
  if (!isConfigured) {
    throw new SubmissionError('This site is not yet connected to its backend.');
  }
  try {
    const created = await storage.createFile({
      bucketId: UPLOADS_BUCKET_ID, fileId: ID.unique(), file,
    });
    return created.$id;
  } catch (err) {
    console.error('[appwrite] file upload failed', err);
    throw new SubmissionError(err?.message || `Could not upload "${file.name}". Please try again.`);
  }
}

export {
  client, tablesDB, account, teams, storage, Query, ID,
  DATABASE_ID, TABLES, ADMIN_TEAM_ID, UPLOADS_BUCKET_ID,
  isConfigured, submitForm, uploadFile, SubmissionError,
};
