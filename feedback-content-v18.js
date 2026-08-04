(() => {
  'use strict';

  const compactPricingHeading = () => {
    const section = document.querySelector('#pricing');
    const heading = section?.querySelector('.fee-v11-heading');
    const title = heading?.querySelector('h2');
    if (!section || !heading || !title) return;

    section.classList.add('fee-journey-v18');
    heading.classList.add('fee-v11-heading-v18');

    title.innerHTML = 'A clear programme <em>fee.</em>';

    heading.querySelector('.fee-v14-stage-line')?.remove();
    heading.querySelectorAll(':scope > p:not(.kicker)').forEach(node => node.remove());
  };

  const enhancePartners = () => {
    const section = document.querySelector('#trust-partners');
    if (!section) return;

    section.classList.add('trust-partners-v18');

    const heading = section.querySelector('.trust-partners-heading');
    const title = heading?.querySelector('h2');
    if (heading) heading.classList.add('trust-partners-heading-v18');
    if (title) title.innerHTML = 'Partners for the<br><em>journey.</em>';

    const grid = section.querySelector('.trust-partners-grid');
    grid?.classList.add('trust-partners-grid-v18');

    section.querySelectorAll('.partner-plaque').forEach((card, index) => {
      card.classList.add('partner-plaque-v18');
      card.style.setProperty('--partner-index', String(index));

      if (!card.querySelector('.partner-plaque-landscape-v18')) {
        const landscape = document.createElement('span');
        landscape.className = 'partner-plaque-landscape-v18';
        landscape.setAttribute('aria-hidden', 'true');
        card.prepend(landscape);
      }
    });
  };

  const run = () => {
    compactPricingHeading();
    enhancePartners();
    document.documentElement.classList.add('pricing-partners-v18');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
