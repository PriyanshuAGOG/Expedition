(() => {
  'use strict';

  const run = () => {
    if (document.body.classList.contains('application-page')) return;

    const summary = document.querySelector('.hero-campaign > p');
    if (!summary) return;

    summary.classList.add('hero-campaign-summary', 'hero-campaign-summary-single');
    summary.innerHTML = '<strong>60 days of preparation · 6 day Himalayan expedition · World Diabetes Day 2026</strong>';
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
