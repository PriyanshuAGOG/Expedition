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
  Client, TablesDB, Account, Teams, Query, ID,
} = window.Appwrite;
import {
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, DATABASE_ID, TABLES, ADMIN_TEAM_ID,
} from '../config/appwrite-config.js';

const isConfigured = APPWRITE_PROJECT_ID && APPWRITE_PROJECT_ID !== 'REPLACE_WITH_YOUR_APPWRITE_PROJECT_ID';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID || 'unconfigured');
const tablesDB = new TablesDB(client);
const account = new Account(client);
const teams = new Teams(client);

class SubmissionError extends Error {}

/**
 * Create a row in one of the public-facing tables (applications,
 * nominations, partnerships).
 *
 * @param {'applications'|'nominations'|'partnerships'} tableKey
 * @param {Record<string, unknown>} data - form fields, matching the table's columns
 * @param {{ honeypot?: string }} [options] - honeypot is a decoy field name;
 *   if it has a value, this silently resolves without submitting (bot traffic)
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
    );
  }
}

export {
  client, tablesDB, account, teams, Query, ID,
  DATABASE_ID, TABLES, ADMIN_TEAM_ID,
  isConfigured, submitForm, SubmissionError,
};
