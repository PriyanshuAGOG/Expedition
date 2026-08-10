(() => {
  'use strict';

  const root = document.documentElement;
  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src
    ? new URL('.', currentScript.src)
    : new URL('./', window.location.href);

  // This is the manifest scripts/build-bundle.mjs reads to produce
  // bundle.css/bundle.js — it is NOT loaded directly at runtime (see
  // `bundledStylesheets`/`bundledScripts` below). Every file listed here
  // still exists individually and is still the place to make edits; after
  // editing any of them, run `node scripts/build-bundle.mjs` to fold the
  // change into the two files the boot sequence actually fetches. See
  // CLAUDE.md for why: loading 47 tiny files individually meant the
  // browser's per-origin connection limit turned this into several
  // serialized waves of requests before the page could ever become
  // visible — bundling cut that to two requests without changing a single
  // line of what any of these files actually do.
  const stylesheets = [
    'feedback-overrides.css',
    'feedback-content-v2.css',
    'feedback-content-v3.css',
    'feedback-content-v5.css',
    'feedback-content-v6.css',
    'feedback-content-v7.css',
    'feedback-content-v8.css',
    'feedback-content-v9.css',
    'feedback-content-v10.css',
    'feedback-content-v11.css',
    'feedback-content-v12.css',
    'feedback-content-v13.css',
    'feedback-content-v13-patch.css',
    'feedback-content-v14.css',
    'feedback-content-v15.css',
    'feedback-content-v15-patch.css',
    'feedback-content-v16.css',
    'feedback-content-v17.css',
    'feedback-content-v18-launch-polish.css',
    'feedback-content-v18.css',
    'feedback-content-v19.css',
    'feedback-content-v20.css',
    'feedback-content-v20-color-fix.css',
    'feedback-content-v23-final.css',
    'feedback-content-v24-register-interest.css'
  ];

  const scripts = [
    'script-base.js',
    'feedback-overrides.js',
    'feedback-content-v2.js',
    'feedback-content-v3.js',
    'feedback-content-v4.js',
    'feedback-content-v5.js',
    'feedback-content-v6.js',
    'feedback-content-v7.js',
    'feedback-content-v8.js',
    'feedback-content-v9.js',
    'feedback-content-v10.js',
    'feedback-content-v11.js',
    'feedback-content-v12.js',
    'feedback-content-v13.js',
    'feedback-content-v14.js',
    'feedback-content-v15.js',
    'feedback-content-v16.js',
    'feedback-content-v18.js',
    'feedback-content-v19.js',
    'feedback-content-v20.js',
    'feedback-content-v21.js',
    'feedback-content-v22-privacy.js',
    'feedback-content-v23-final.js',
    'feedback-content-v24-register-interest.js'
  ];

  // What the boot sequence actually fetches. Regenerated from the two
  // manifests above by scripts/build-bundle.mjs — see the comment on
  // `stylesheets` above.
  const bundledStylesheets = ['bundle.css'];
  const bundledScripts = ['bundle.js'];

  root.classList.add('expedition-booting');
  root.classList.remove('expedition-ready');

  let hasRevealed = false;
  let failsafeTimer;

  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

  const revealFinalPage = async () => {
    if (hasRevealed) return;
    hasRevealed = true;
    clearTimeout(failsafeTimer);

    await nextFrame();
    await nextFrame();

    root.classList.remove('expedition-booting');
    root.classList.add('expedition-ready');

    document.dispatchEvent(new CustomEvent('expedition:ready'));
  };

  const loadStylesheet = filename => new Promise(resolve => {
    const href = new URL(filename, baseUrl).href;
    const existing = [...document.styleSheets]
      .map(sheet => sheet.href)
      .filter(Boolean)
      .includes(href);

    if (existing) {
      resolve({ filename, loaded: true, cached: true });
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.expeditionModule = filename;
    link.addEventListener('load', () => resolve({ filename, loaded: true }), { once: true });
    link.addEventListener('error', () => {
      console.warn(`[Expedition] Stylesheet failed to load: ${filename}`);
      resolve({ filename, loaded: false });
    }, { once: true });
    document.head.appendChild(link);
  });

  const loadScript = filename => new Promise(resolve => {
    const src = new URL(filename, baseUrl).href;
    const existing = [...document.scripts].find(script => script.src === src);

    if (existing) {
      resolve({ filename, loaded: true, cached: true });
      return;
    }

    const module = document.createElement('script');
    module.src = src;
    module.async = false;
    module.dataset.expeditionModule = filename;
    module.addEventListener('load', () => resolve({ filename, loaded: true }), { once: true });
    module.addEventListener('error', () => {
      console.warn(`[Expedition] Script failed to load: ${filename}`);
      resolve({ filename, loaded: false });
    }, { once: true });
    document.body.appendChild(module);
  });

  const waitForFonts = async () => {
    if (!document.fonts?.ready) return;
    // The site only uses system fonts (no @font-face) so fonts.ready
    // resolves as soon as those are located locally — no network wait.
    // The delay() here is only a safety cap for the rare case that never
    // resolves, not an expected wait, so it can stay short.
    await Promise.race([document.fonts.ready, delay(250)]);
  };

  const boot = async () => {
    try {
      await Promise.all(bundledStylesheets.map(loadStylesheet));

      // bundle.js is one file (the ~24 modules it contains already run in
      // their original order, back to back, because it's a literal
      // concatenation — see scripts/build-bundle.mjs), so there's no
      // ordering to preserve across multiple loadScript() calls here
      // anymore. Promise.all still reads correctly if bundledScripts ever
      // grows back to more than one entry.
      await Promise.all(bundledScripts.map(loadScript));

      await waitForFonts();

      const buildMeta = document.querySelector('meta[name="build-version"]');
      buildMeta?.setAttribute('content', '2026.08.07-final-landing-copy-hero-v23');
    } catch (error) {
      console.error('[Expedition] Final production boot failed safely.', error);
    } finally {
      await revealFinalPage();
    }
  };

  failsafeTimer = window.setTimeout(() => {
    // Was 12s — with the boot sequence now down to two bundled requests
    // instead of 47, anything still not ready by 6s is a genuine stall
    // (offline, blocked request), not normal loading time, so there's no
    // reason to leave a real visitor staring at a blank screen for 12s
    // waiting to find that out.
    console.warn('[Expedition] Boot timeout reached; revealing the best available state.');
    revealFinalPage();
  }, 6000);

  boot();
})();
