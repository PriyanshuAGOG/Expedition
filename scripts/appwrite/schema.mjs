// Single source of truth for the Appwrite database schema used by the
// provisioning script (provision.mjs). Plain data only (no SDK calls here)
// so it stays easy to read and diff.
//
// Naming: Appwrite's newer TablesDB API calls these Tables/Columns/Rows
// instead of Collections/Attributes/Documents. This file keeps the more
// familiar "collection"/"attribute" names for readability — provision.mjs
// is what maps them onto the actual TablesDB SDK calls.
//
// IDs here (database, collection, team, bucket IDs) are also relied on by
// the browser-side config at assets/config/appwrite-config.js — if you
// rename anything here, update that file to match.

export const DATABASE_ID = 'expedition';
export const DATABASE_NAME = 'World Diabetes Day Expedition';

export const ADMIN_TEAM_ID = 'admins';
export const ADMIN_TEAM_NAME = 'Admins';

export const UPLOADS_BUCKET_ID = 'evidence_uploads';
export const UPLOADS_BUCKET_NAME = 'Evidence & Media Uploads';

// Shared status lifecycle fields keep every lead collection triage-able the
// same way in the admin panel.
const APPLICATION_STATUSES = [
  'new', 'reviewing', 'shortlisted', 'medical_review', 'cleared', 'waitlisted', 'rejected', 'withdrawn',
];
const NOMINATION_STATUSES = ['new', 'contacted', 'invited', 'declined', 'archived'];
const PARTNERSHIP_STATUSES = ['new', 'in_discussion', 'confirmed', 'declined', 'archived'];

const adminOnlyPermissions = () => ([
  `create("any")`,
  `read("team:${ADMIN_TEAM_ID}")`,
  `update("team:${ADMIN_TEAM_ID}")`,
  `delete("team:${ADMIN_TEAM_ID}")`,
]);

// Attribute shorthand helpers. `type` matches the node-appwrite method suffix
// (string/email/integer/float/boolean/enum) that provision.mjs dispatches on.
const str = (key, size, required, opts = {}) => ({ type: 'string', key, size, required, array: false, ...opts });
const strArray = (key, size, opts = {}) => ({ type: 'string', key, size, required: false, array: true, ...opts });
const email = (key, required, opts = {}) => ({ type: 'email', key, required, array: false, ...opts });
const int = (key, required, opts = {}) => ({ type: 'integer', key, required, array: false, ...opts });
const float = (key, required, opts = {}) => ({ type: 'float', key, required, array: false, ...opts });
const bool = (key, required, opts = {}) => ({ type: 'boolean', key, required, array: false, ...opts });
const enumAttr = (key, elements, required, opts = {}) => ({ type: 'enum', key, elements, required, array: false, ...opts });

export const collections = [
  {
    id: 'applications',
    name: 'Applications',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('fullName', 200, true),
      email('email', true),
      str('phone', 40, true),
      int('age', true, { min: 18, max: 80 }),
      str('city', 120, true),
      str('state', 120, true),
      str('country', 120, true),
      int('diagnosisYear', true, { min: 1970, max: 2100 }),
      // Must match the <select name="treatment"> options rendered by
      // configureApplicationForm() in feedback-overrides.js — that script
      // rewrites the options at runtime, overriding what's in apply.html.
      enumAttr('treatment', [
        'On medication', 'On insulin', 'Both medication and insulin', 'None of the above',
      ], true),
      float('hba1c', false, { min: 3, max: 20 }),
      strArray('conditions', 40),
      enumAttr('timeCommitment', ['Yes', 'I need to discuss my schedule', 'No'], true),
      enumAttr('availability', ['Yes', 'Likely, pending confirmation', 'No'], true),
      str('motivation', 1200, true),
      str('emergencyName', 200, true),
      str('emergencyPhone', 40, true),
      str('emergencyRelationship', 120, true),
      // Consent fields mirror consentMarkup() in feedback-overrides.js,
      // which replaces apply.html's static consent checkboxes at runtime.
      bool('consentAccuracy', true),
      bool('consentSelection', true),
      bool('consentExpeditionContact', true),
      bool('consentDpdp', true),
      bool('consentFutureContact', false, { default: false }),
      // Not `required`: Appwrite forbids required+default together, and the
      // default is exactly what makes this safe to omit from public submits.
      enumAttr('status', APPLICATION_STATUSES, false, { default: 'new' }),
      str('source', 60, false, { default: 'web' }),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_email', type: 'key', attributes: ['email'] },
    ],
  },
  {
    // Matches the nomination-dialog-form in feedback-content-v8.js, which
    // only collects the nominee's own details (no nominator identity, no
    // message) — keep this table in sync if that dialog's fields change.
    id: 'nominations',
    name: 'Nominations',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('nomineeName', 200, true),
      email('nomineeEmail', false),
      str('nomineePhone', 40, true),
      enumAttr('status', NOMINATION_STATUSES, false, { default: 'new' }),
      str('source', 60, false, { default: 'web' }),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('contactName', 200, true),
      str('organisation', 200, false),
      email('email', true),
      str('phone', 40, false),
      enumAttr('partnershipType', [
        'Health', 'Equipment', 'Travel & Logistics', 'Media & Storytelling', 'Other',
      ], true),
      str('message', 1200, true),
      enumAttr('status', PARTNERSHIP_STATUSES, false, { default: 'new' }),
      str('source', 60, false, { default: 'web' }),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
];
