# Vendored Appwrite Web SDK

`sdk.js` is the unmodified IIFE (browser-global) build from the official
`appwrite` npm package (`dist/iife/sdk.js`), vendored locally instead of
loaded from a CDN so the site keeps working the way the rest of its assets
do — no third-party runtime request on page load, and no bundler needed.

The IIFE build (not the ESM build) is used deliberately: the ESM build
imports the `json-bigint` package as a bare specifier, which only resolves
under a bundler or import map. The IIFE build inlines every dependency and
attaches everything to `window.Appwrite` (`window.Appwrite.Client`,
`window.Appwrite.TablesDB`, etc.), so it works as a plain `<script>` tag.

- Source: https://www.npmjs.com/package/appwrite
- Vendored version: **26.2.0**

To update: `npm view appwrite version` to check the latest, then
`npm pack appwrite@<version>`, extract, and replace `sdk.js` with the new
`package/dist/iife/sdk.js`. Re-check `scripts/appwrite/provision.mjs` and
`assets/js/appwrite-client.js` against the new version's types if it's a
major version bump.
