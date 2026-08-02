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
  loadStylesheet('feedback-content-v3.css', 'data-feedback-content-v3', 'feedbackContentV3');
  loadStylesheet('feedback-content-v5.css', 'data-feedback-content-v5', 'feedbackContentV5');
  loadStylesheet('feedback-content-v6.css', 'data-feedback-content-v6', 'feedbackContentV6');
  loadStylesheet('feedback-content-v7.css', 'data-feedback-content-v7', 'feedbackContentV7');
  loadStylesheet('feedback-content-v8.css', 'data-feedback-content-v8', 'feedbackContentV8');
  loadStylesheet('feedback-content-v9.css', 'data-feedback-content-v9', 'feedbackContentV9');
  loadStylesheet('feedback-content-v10.css', 'data-feedback-content-v10', 'feedbackContentV10');

  const loadContentV10 = () => {
    if (document.querySelector('script[data-feedback-content-v10]')) return;
    const finalQa = document.createElement('script');
    finalQa.src = new URL('feedback-content-v10.js', baseUrl).href;
    finalQa.async = false;
    finalQa.dataset.feedbackContentV10 = 'true';
    document.body.appendChild(finalQa);
  };

  const loadContentV9 = () => {
    if (document.querySelector('script[data-feedback-content-v9]')) {
      loadContentV10();
      return;
    }
    const polish = document.createElement('script');
    polish.src = new URL('feedback-content-v9.js', baseUrl).href;
    polish.async = false;
    polish.dataset.feedbackContentV9 = 'true';
    polish.addEventListener('load', loadContentV10, { once: true });
    polish.addEventListener('error', loadContentV10, { once: true });
    document.body.appendChild(polish);
  };

  const loadContentV8 = () => {
    if (document.querySelector('script[data-feedback-content-v8]')) {
      loadContentV9();
      return;
    }
    const experience = document.createElement('script');
    experience.src = new URL('feedback-content-v8.js', baseUrl).href;
    experience.async = false;
    experience.dataset.feedbackContentV8 = 'true';
    experience.addEventListener('load', loadContentV9, { once: true });
    experience.addEventListener('error', loadContentV9, { once: true });
    document.body.appendChild(experience);
  };

  const loadContentV7 = () => {
    if (document.querySelector('script[data-feedback-content-v7]')) {
      loadContentV8();
      return;
    }
    const redesign = document.createElement('script');
    redesign.src = new URL('feedback-content-v7.js', baseUrl).href;
    redesign.async = false;
    redesign.dataset.feedbackContentV7 = 'true';
    redesign.addEventListener('load', loadContentV8, { once: true });
    redesign.addEventListener('error', loadContentV8, { once: true });
    document.body.appendChild(redesign);
  };

  const loadContentV6 = () => {
    if (document.querySelector('script[data-feedback-content-v6]')) {
      loadContentV7();
      return;
    }
    const gains = document.createElement('script');
    gains.src = new URL('feedback-content-v6.js', baseUrl).href;
    gains.async = false;
    gains.dataset.feedbackContentV6 = 'true';
    gains.addEventListener('load', loadContentV7, { once: true });
    gains.addEventListener('error', loadContentV7, { once: true });
    document.body.appendChild(gains);
  };

  const loadContentV5 = () => {
    if (document.querySelector('script[data-feedback-content-v5]')) {
      loadContentV6();
      return;
    }
    const polish = document.createElement('script');
    polish.src = new URL('feedback-content-v5.js', baseUrl).href;
    polish.async = false;
    polish.dataset.feedbackContentV5 = 'true';
    polish.addEventListener('load', loadContentV6, { once: true });
    polish.addEventListener('error', loadContentV6, { once: true });
    document.body.appendChild(polish);
  };

  const loadContentV4 = () => {
    if (document.querySelector('script[data-feedback-content-v4]')) {
      loadContentV5();
      return;
    }
    const polish = document.createElement('script');
    polish.src = new URL('feedback-content-v4.js', baseUrl).href;
    polish.async = false;
    polish.dataset.feedbackContentV4 = 'true';
    polish.addEventListener('load', loadContentV5, { once: true });
    polish.addEventListener('error', loadContentV5, { once: true });
    document.body.appendChild(polish);
  };

  const loadContentV3 = () => {
    if (document.querySelector('script[data-feedback-content-v3]')) {
      loadContentV4();
      return;
    }
    const refinements = document.createElement('script');
    refinements.src = new URL('feedback-content-v3.js', baseUrl).href;
    refinements.async = false;
    refinements.dataset.feedbackContentV3 = 'true';
    refinements.addEventListener('load', loadContentV4, { once: true });
    refinements.addEventListener('error', loadContentV4, { once: true });
    document.body.appendChild(refinements);
  };

  const loadContentV2 = () => {
    if (document.querySelector('script[data-feedback-content-v2]')) {
      loadContentV3();
      return;
    }
    const refinements = document.createElement('script');
    refinements.src = new URL('feedback-content-v2.js', baseUrl).href;
    refinements.async = false;
    refinements.dataset.feedbackContentV2 = 'true';
    refinements.addEventListener('load', loadContentV3, { once: true });
    refinements.addEventListener('error', loadContentV3, { once: true });
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
