(() => {
  'use strict';

  const run = () => {
    if (document.body.classList.contains('application-page')) return;
    const label = document.querySelector('.fee-stage-primary .fee-stage-topline small');
    if (label) label.textContent = '60-day preparatory programme';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
