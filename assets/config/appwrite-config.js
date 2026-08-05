// Public Appwrite configuration.
//
// These values are safe to expose in client-side code — an Appwrite
// endpoint + project ID is not a secret, the same way a website's domain
// isn't. Real security comes from the permission rules defined in
// scripts/appwrite/schema.mjs (public "create" only, admin-team-only
// "read"/"update"/"delete"), not from hiding these values.
//
// Pointed at the "production" Appwrite project (Frankfurt region). Remaining
// setup:
//   1. Add this site's real domain (and http://localhost for local dev) as
//      a Web platform in the Appwrite console (Project Settings → Platforms)
//      — the SDK is rejected with a CORS-style error from any origin that
//      isn't registered there, project ID alone isn't enough.
//   2. Add APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY to the
//      "production" GitHub Environment (Settings → Environments →
//      production → Environment secrets) and run the "Provision Appwrite
//      schema" Action to create the database described in
//      scripts/appwrite/schema.mjs.
//   3. Create at least one admin user (Appwrite console → Auth → Create
//      user) and add them to the "admins" team so they can sign in at
//      /entries/.

export const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '6a71c2e9003a0fbf8940';

// Must match scripts/appwrite/schema.mjs.
export const DATABASE_ID = 'expedition';
export const TABLES = {
  applications: 'applications',
  nominations: 'nominations',
  partnerships: 'partnerships',
  applicationHistory: 'applicationHistory',
};
export const ADMIN_TEAM_ID = 'admins';
export const UPLOADS_BUCKET_ID = 'evidence_uploads';
