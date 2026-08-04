// Public Appwrite configuration.
//
// These values are safe to expose in client-side code — an Appwrite
// endpoint + project ID is not a secret, the same way a website's domain
// isn't. Real security comes from the permission rules defined in
// scripts/appwrite/schema.mjs (public "create" only, admin-team-only
// "read"/"update"/"delete"), not from hiding these values.
//
// Setup:
//   1. Create a project at https://cloud.appwrite.io and paste its
//      Project ID below.
//   2. Add this site's domain (and http://localhost during development) as
//      a Web platform in the Appwrite console (Project Settings → Platforms).
//   3. Add APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY as
//      GitHub repo secrets and run the "Provision Appwrite schema" Action
//      to create the database described in scripts/appwrite/schema.mjs.
//   4. Create at least one admin user (Appwrite console → Auth → Create
//      user) and add them to the "admins" team so they can sign in at
//      /admin/.

export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = 'REPLACE_WITH_YOUR_APPWRITE_PROJECT_ID';

// Must match scripts/appwrite/schema.mjs.
export const DATABASE_ID = 'expedition';
export const TABLES = {
  applications: 'applications',
  nominations: 'nominations',
  partnerships: 'partnerships',
};
export const ADMIN_TEAM_ID = 'admins';
