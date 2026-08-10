# Nirog Bhumi — World Diabetes Day Himalayan Expedition 2026

Static site (no framework, no build step by default) for a health/travel
expedition programme. Deployed as-is from the repo root — there is no
`npm run build` in the deploy path.

## Rendering pipeline (index.html / apply.html only)

`index.html` and `apply.html` load `styles-base.css` + `styles.css`, then a
single `<script src="script.js">` at the end of `<body>`. `script.js` is a
small boot orchestrator: it fetches `bundle.css` and `bundle.js`, waits for
them plus system fonts, then flips `html.expedition-ready` — a CSS boot
gate (`html:not(.expedition-ready) body { visibility: hidden }` in
`styles.css`) keeps the page invisible until then, so nothing ever flashes
in piecemeal.

`bundle.css`/`bundle.js` are **generated files** — concatenations of the
site's ~25 `feedback-content-vN.css`/`.js` files (plus `script-base.js`,
`feedback-overrides.*`), in the exact order they'd otherwise load in. Each
of those source files still exists individually and is still where you make
edits — nothing about the multi-file, numbered-version editing pattern
changed. Only what the browser *fetches* changed.

**After editing any file in `script.js`'s `stylesheets`/`scripts` arrays,
regenerate the bundles:**

```
node scripts/build-bundle.mjs
```

If you forget, the site keeps working from the browser's perspective — it
just silently serves the pre-edit bundle content until you regenerate. Not
a crash, just easy to miss, so make it a habit whenever you touch one of
those files.

### Why bundling exists

The site was originally 47 separate small CSS/JS files, each with its own
`<link>`/`<script>` tag, injected by `script.js` one array entry at a time.
That's great for making small, isolated changes without touching a large
file, but it made first load slow (measured ~8s under throttled network,
~0.6s with no artificial latency) — not because of script execution time or
total bytes, but because the browser caps concurrent requests per origin at
~6 for HTTP/1.1, so 47 tiny files became several serialized waves of
requests before the boot gate could ever lift. Bundling into two files
(`bundle.css`, `bundle.js`) cut that to ~30% of the original load time in
both throttled and unthrottled testing, without changing a single line of
what any individual module actually does — same code, same execution
order (JS bundle is a literal concatenation, so the modules that depend on
DOM built by earlier modules still see it in the same order).

### Other load-time-relevant details

- Images below the hero (`.parallax-hero`, the first `<section>` in
  `index.html`) should have `loading="lazy"` — everything in the hero
  itself stays eager since it's the very first thing visible. Check this
  when adding new images to any landing-page section.
- The `#nature-audio` background-ambience element uses
  `preload="metadata"`, not `auto` — its play logic (`script-base.js`)
  only ever primes/plays after a user gesture, so nothing needs the full
  file downloaded before then.
- `apply.html`/`index.html` link `styles-base.css` directly (not via
  `styles.css`'s old `@import`) so both fetch in parallel instead of
  `@import` forcing one sequential extra round trip before any CSS —
  keep both `<link>` tags if you ever touch these `<head>`s.

## Other standalone pages

`policies/*.html` and `consent-withdrawal.html` deliberately sit **outside**
this pipeline — they load only `styles-base.css` (never `styles.css`, which
would permanently hide them behind a boot gate that only `script.js`'s
sequence ever lifts) plus their own `assets/policies.css`, and have no
`script.js`/bundle dependency at all. `entries/` (the admin panel) is a
separate, credential-gated app with its own `panel.js`/`panel.css`.

## Backend

Appwrite (TablesDB). Schema lives in `scripts/appwrite/schema.mjs`;
`scripts/appwrite/provision.mjs` is an idempotent provisioning script run
manually via the "Provision Appwrite schema" GitHub Action
(`.github/workflows/appwrite-provision.yml`, `workflow_dispatch` only —
never on push, since it writes to the live project). Re-run it after any
schema.mjs change.
