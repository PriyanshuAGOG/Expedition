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

The site is a dependency-free static HTML, CSS and JavaScript project.

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

## Privacy and registration safety

The current browser prototype validates application details but does not transmit or store health information. Production intake requires a secure approved endpoint, authentication, access controls, final consent language, retention rules and privacy review. Medical documents should be collected through a separate secure clinical workflow.

## Brand system

- Deep forest: `#07120d`
- Forest: `#0d2118`
- Young leaf: `#d7f6a8`
- Moss: `#b8d49c`
- Cream: `#f3f0e7`
- Paper: `#e5eadf`

The visual system combines Himalayan landscapes, botanical foregrounds, topographic details and restrained medical-readiness cues within NirogBhumi’s nature-led identity.
