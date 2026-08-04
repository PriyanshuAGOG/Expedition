# NirogBhumi World Diabetes Day Himalayan Expedition 2026

Production landing page for NirogBhumi’s World Diabetes Day Himalayan Expedition 2026.

## Current programme

- 45-day structured preparation programme
- Six-day Dayara Bugyal expedition window
- Medical screening and final medical clearance
- Five preparation pillars: Medical, Lifestyle, Fitness and Yog, Mind, and Community
- Participant journey, safety framework, eligibility, programme fee, FAQs and application flow
- Responsive layouts for mobile, tablet, laptop and desktop

## Production architecture

The site is a static HTML, CSS and JavaScript project with no build step or
framework. The one runtime dependency is the Appwrite Web SDK, vendored
locally at `assets/vendor/appwrite/` rather than build-installed (see
"Backend" below).

- `index.html` contains the landing-page structure and expedition assets.
- `styles.css` is the render-blocking production bootstrap.
- `styles-base.css` preserves the complete base visual system.
- `script.js` loads the final enhancement styles first, then runs enhancement scripts in deterministic order.
- The document remains hidden until the final interface is ready, preventing older intermediate layouts from flashing during first load.
- A 12-second failsafe reveals the best available state if a resource unexpectedly stalls.

The historical enhancement files remain in the repository because the final interface currently depends on their ordered transformations. They must not be loaded independently.

## Run locally

Serve the repository root with any static server and open `index.html`.

```bash
npx serve .
```

The project has no package installation or runtime dependency requirement.

## Backend (Appwrite) and admin panel

Form submissions (the application form, "Nominate someone", and "Become a
partner") are stored in Appwrite. Every table only grants the public
permission to *create* a row — reading, updating, or deleting requires
membership in the Admins team, so a submission can't be read back by the
person who submitted it. See `entries/` for the lead-management panel
(search, status triage, CSV export) and `scripts/appwrite/schema.mjs` for
the full schema.

**A note on the panel's URL:** `entries/` is named that way instead of
`admin/` to avoid casual discovery on the live site, but this repository
is public — anyone can see this folder in the GitHub file tree regardless
of what it's named. The real access control is Appwrite's own permission
system (see above), not the URL. If you want the path itself to stay
private too, make this repository private in GitHub Settings.

First-time setup:

1. Create a project at [Appwrite Cloud](https://cloud.appwrite.io) and add
   this site's domain (plus `http://localhost` for local dev) as a Web
   platform under Project Settings → Platforms.
2. Add `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY`
   (a server key with `databases`/`teams`/`buckets` write scopes) as
   GitHub repo secrets, then run the **Provision Appwrite schema** Action
   from the Actions tab. It's idempotent — safe to re-run after schema
   changes.
3. Paste the Project ID into `assets/config/appwrite-config.js` (this
   value is public/safe to commit — see the comment in that file for why).
4. Create an admin user in the Appwrite console (Auth → Create user) and
   add them to the `admins` team, or set the `APPWRITE_ADMIN_EMAILS` repo
   secret and re-run the provisioning Action to add them automatically.
5. Sign in at `/entries/`.

Medical documents are still never collected through this form — the
application form is an initial screen only; clinical intake happens
through a separate secure process.

## Brand system

- Deep forest: `#07120d`
- Forest: `#0d2118`
- Young leaf: `#d7f6a8`
- Moss: `#b8d49c`
- Cream: `#f3f0e7`
- Paper: `#e5eadf`

The visual system combines Himalayan landscapes, botanical foregrounds, topographic details and restrained medical-readiness cues within NirogBhumi’s nature-led identity.
