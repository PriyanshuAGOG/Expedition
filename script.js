(() => {
  'use strict';

  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src ? new URL('.', currentScript.src) : new URL('./', location.href);

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
    'feedback-content-v12.css'
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
    'feedback-content-v12.js'
  ];

  stylesheets.forEach(filename => {
    const href = new URL(filename, baseUrl).href;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.expeditionModule = filename;
    document.head.appendChild(link);
  });

  const loadScript = index => {
    if (index >= scripts.length) return;
    const filename = scripts[index];
    const src = new URL(filename, baseUrl).href;
    const existing = [...document.scripts].find(script => script.src === src);
    if (existing) {
      loadScript(index + 1);
      return;
    }

    const module = document.createElement('script');
    module.src = src;
    module.async = false;
    module.dataset.expeditionModule = filename;
    module.addEventListener('load', () => loadScript(index + 1), { once: true });
    module.addEventListener('error', () => loadScript(index + 1), { once: true });
    document.body.appendChild(module);
  };

  loadScript(0);
})();
