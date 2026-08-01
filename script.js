(() => {
  'use strict';

  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src ? new URL('.', currentScript.src) : new URL('./', location.href);

  if (!document.querySelector('link[data-feedback-overrides]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('feedback-overrides.css', baseUrl).href;
    stylesheet.dataset.feedbackOverrides = 'true';
    document.head.appendChild(stylesheet);
  }

  const loadEnhancements = () => {
    if (document.querySelector('script[data-feedback-overrides]')) return;
    const enhancements = document.createElement('script');
    enhancements.src = new URL('feedback-overrides.js', baseUrl).href;
    enhancements.async = false;
    enhancements.dataset.feedbackOverrides = 'true';
    document.body.appendChild(enhancements);
  };

  const base = document.createElement('script');
  base.src = new URL('script-base.js', baseUrl).href;
  base.async = false;
  base.dataset.expeditionBase = 'true';
  base.addEventListener('load', loadEnhancements, { once: true });
  base.addEventListener('error', loadEnhancements, { once: true });
  document.body.appendChild(base);
})();
