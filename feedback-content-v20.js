(() => {
  'use strict';

  const rebuildPricingHeader = () => {
    const section = document.querySelector('#pricing');
    const inner = section?.querySelector('.fee-v11-inner');
    const overview = section?.querySelector('.fee-v11-overview');
    if (!section || !inner || !overview) return;

    section.classList.add('fee-v20');
    inner.querySelectorAll('.fee-v11-heading, .fee-heading-v20').forEach(node => node.remove());

    const header = document.createElement('header');
    header.className = 'fee-heading-v20';
    header.setAttribute('aria-labelledby', 'fee-heading-v20-title');
    header.innerHTML = `
      <p class="kicker">Programme pricing</p>
      <h2 id="fee-heading-v20-title">A clear programme <em>fee.</em></h2>`;

    overview.insertAdjacentElement('beforebegin', header);
  };

  const partnerData = card => {
    const image = card.querySelector('img');
    const category = card.querySelector('small')?.textContent?.trim() || 'Expedition partner';
    const alt = image?.getAttribute('alt')?.trim() || 'Partner';
    const brand = alt.split(/[—–|-]/)[0].trim() || 'Partner';

    return {
      src: image?.getAttribute('src') || '',
      alt,
      brand,
      category
    };
  };

  const rebuildPartners = () => {
    const section = document.querySelector('#trust-partners');
    const grid = section?.querySelector('.trust-partners-grid');
    const heading = section?.querySelector('.trust-partners-heading');
    if (!section || !grid || !heading) return;

    section.classList.add('trust-partners-v20');
    heading.className = 'trust-partners-heading trust-partners-heading-v20';
    heading.innerHTML = `
      <p class="kicker">Our partners</p>
      <h2 id="trust-partners-title">Partners behind<br><em>the expedition.</em></h2>`;

    const partners = [...grid.querySelectorAll('.partner-plaque')].map(partnerData);
    grid.className = 'trust-partners-grid trust-partners-grid-v20';
    grid.innerHTML = '';

    partners.forEach(partner => {
      const tile = document.createElement('article');
      tile.className = 'partner-tile-v20';
      tile.setAttribute('aria-label', `${partner.brand}, ${partner.category}`);
      tile.innerHTML = `
        <div class="partner-logo-stage-v20">
          <img src="${partner.src}" alt="${partner.alt}" loading="lazy" decoding="async">
        </div>
        <div class="partner-tile-meta-v20">
          <strong>${partner.brand}</strong>
          <span>${partner.category}</span>
        </div>`;
      grid.appendChild(tile);
    });
  };

  const run = () => {
    rebuildPricingHeader();
    rebuildPartners();
    document.documentElement.classList.add('pricing-partner-grid-v20');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
