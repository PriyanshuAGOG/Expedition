(() => {
  'use strict';

  const currentScript = document.currentScript;
  const baseUrl = currentScript?.src ? new URL('.', currentScript.src) : new URL('./', location.href);

  const loadStylesheet = (filename, dataAttribute, datasetKey) => {
    if (document.querySelector(`link[${dataAttribute}]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL(filename, baseUrl).href;
    stylesheet.dataset[datasetKey] = 'true';
    document.head.appendChild(stylesheet);
  };

  loadStylesheet('feedback-overrides.css', 'data-feedback-overrides', 'feedbackOverrides');
  loadStylesheet('feedback-content-v2.css', 'data-feedback-content-v2', 'feedbackContentV2');

  const loadContentV2 = () => {
    if (document.querySelector('script[data-feedback-content-v2]')) return;
    const refinements = document.createElement('script');
    refinements.src = new URL('feedback-content-v2.js', baseUrl).href;
    refinements.async = false;
    refinements.dataset.feedbackContentV2 = 'true';
    document.body.appendChild(refinements);
  };

  const loadEnhancements = () => {
    if (document.querySelector('script[data-feedback-overrides]')) {
      loadContentV2();
      return;
    }
    const enhancements = document.createElement('script');
    enhancements.src = new URL('feedback-overrides.js', baseUrl).href;
    enhancements.async = false;
    enhancements.dataset.feedbackOverrides = 'true';
    enhancements.addEventListener('load', loadContentV2, { once: true });
    enhancements.addEventListener('error', loadContentV2, { once: true });
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
