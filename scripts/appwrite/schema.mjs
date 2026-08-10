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
const PRIVACY_REQUEST_STATUSES = ['new', 'in_progress', 'completed', 'rejected'];
// Mirrors the rights listed in the DPDP Consent Notice (feedback-content-v22-privacy.js,
// section 8): access, correction, erasure, withdrawal of consent, and grievance
// redressal, plus a catch-all for anything that doesn't fit those categories.
const PRIVACY_REQUEST_TYPES = [
  'Access my data', 'Correct my data', 'Erase my data', 'Withdraw consent', 'Grievance / complaint', 'Other',
];

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
// Unbounded text (Appwrite's createTextColumn, no `size` param) — unlike a
// large `string` column, this isn't stored inline in the row, so it doesn't
// count against MariaDB's ~65KB row-width cap. Use this instead of str()
// with a big size for anything that can genuinely grow large (JSON blobs,
// free-form long text); a table can only afford one or two large `string`
// columns before hitting "maximum number or size of columns" on creation.
const text = (key, required, opts = {}) => ({ type: 'text', key, required, array: false, ...opts });
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
      // Deprecated: no longer collected on the form (medical reports are
      // requested instead, via the optional upload below). Column kept so
      // historical applications that already have a value aren't destroyed.
      float('hba1c', false, { min: 3, max: 20 }),
      int('bpSystolic', true, { min: 60, max: 260 }),
      int('bpDiastolic', true, { min: 30, max: 180 }),
      strArray('conditions', 40),
      enumAttr('timeCommitment', ['Yes', 'No'], true),
      enumAttr('availability', ['Yes', 'Likely, pending confirmation', 'No'], true),
      str('motivation', 1200, true),
      // Metadata for files uploaded to UPLOADS_BUCKET_ID; the files
      // themselves live in Storage, not in this row.
      strArray('medicalReportFileIds', 60),
      strArray('medicalReportFileNames', 200),
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
      // Admin-only triage notes — never written by the public create call,
      // only by the admin panel (which is the only role with update rights).
      str('internalNotes', 2000, false),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      // Database-level duplicate protection for participant applications.
      // The browser cannot check for an existing application first — every
      // table is create-only for the public and readable only by the Admins
      // team — so uniqueness has to be enforced here, where it also survives
      // concurrent submits and repeated retries. The client stores `email`
      // lowercased/trimmed and `phone` stripped of spaces, brackets, hyphens
      // and dots (script-base.js normaliseEmail/normalisePhone), so these
      // indexes compare normalised values and formatting variants of the
      // same address or number collide as intended.
      //
      // The review -> edit -> resubmit flow upserts one fixed row id per
      // session, so editing an existing application updates that same row and
      // is never rejected as a duplicate of itself.
      { key: 'uniq_email', type: 'unique', attributes: ['email'] },
      { key: 'uniq_phone', type: 'unique', attributes: ['phone'] },
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
      str('internalNotes', 2000, false),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  {
    // One row per edit to an existing application, so admins can see what
    // changed and when. Written by the public client alongside every
    // resubmit of an already-created application (create-only permission,
    // same as the other tables) — never by editing the `applications` row
    // in place, which stays the single current-state record.
    id: 'applicationHistory',
    name: 'Application History',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('applicationId', 64, true),
      str('changedAt', 40, true),
      str('changeSource', 40, false, { default: 'participant_edit' }),
      strArray('changedFields', 60),
      text('previousValues', false),
      text('newValues', false),
      strArray('filesAdded', 60),
      strArray('filesRemoved', 60),
    ],
    indexes: [
      { key: 'idx_applicationId', type: 'key', attributes: ['applicationId'] },
    ],
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('contactName', 200, true),
      // Organisation and phone are mandatory on the Support the Expedition
      // form (second pass). Required here as well as in the browser so a
      // request that skips the form's own validation is still rejected.
      str('organisation', 200, true),
      email('email', true),
      str('phone', 40, true),
      enumAttr('partnershipType', [
        'Health', 'Equipment', 'Travel & Logistics', 'Media & Storytelling', 'Other',
      ], true),
      str('message', 1200, true),
      enumAttr('status', PARTNERSHIP_STATUSES, false, { default: 'new' }),
      str('source', 60, false, { default: 'web' }),
      str('internalNotes', 2000, false),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
  {
    // Backs the site's consent-withdrawal / privacy-request form
    // (consent-withdrawal.html), linked from the footer and from the DPDP
    // notice. A public, unauthenticated site can't verify who is submitting
    // a rights request, so this only records the request for an admin to
    // action manually against the matching application/nomination/
    // partnership row — it does not itself delete or alter any other table.
    id: 'privacyRequests',
    name: 'Privacy Requests',
    permissions: adminOnlyPermissions(),
    attributes: [
      str('fullName', 200, true),
      email('email', true),
      str('phone', 40, false),
      enumAttr('requestType', PRIVACY_REQUEST_TYPES, true),
      // Free-text pointer the requester supplies to help an admin locate
      // their existing record (the email/phone they applied with, an
      // application reference, etc.) — not a foreign key, since a privacy
      // request must still be accepted even if it doesn't match anything.
      str('applicationReference', 200, false),
      str('details', 2000, true),
      enumAttr('status', PRIVACY_REQUEST_STATUSES, false, { default: 'new' }),
      str('source', 60, false, { default: 'web' }),
      str('internalNotes', 2000, false),
    ],
    indexes: [
      { key: 'idx_status', type: 'key', attributes: ['status'] },
    ],
  },
];
