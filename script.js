(() => {
  'use strict';

  const root = document.documentElement;
  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src
    ? new URL('.', currentScript.src)
    : new URL('./', window.location.href);

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
    'feedback-content-v17.css'
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
    'feedback-content-v16.js'
  ];

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
    await Promise.race([document.fonts.ready, delay(1600)]);
  };

  const boot = async () => {
    try {
      /* Load every final stylesheet before any DOM-transforming enhancement runs. */
      await Promise.all(stylesheets.map(loadStylesheet));

      /* Preserve the historical dependency order without exposing intermediate states. */
      for (const filename of scripts) {
        await loadScript(filename);
      }

      await waitForFonts();

      const buildMeta = document.querySelector('meta[name="build-version"]');
      buildMeta?.setAttribute('content', '2026.08.04-final-consolidated-production');
    } catch (error) {
      console.error('[Expedition] Final production boot failed safely.', error);
    } finally {
      await revealFinalPage();
    }
  };

  /* Never leave the document permanently hidden if a third-party resource stalls. */
  failsafeTimer = window.setTimeout(() => {
    console.warn('[Expedition] Boot timeout reached; revealing the best available state.');
    revealFinalPage();
  }, 12000);

  boot();
})();
