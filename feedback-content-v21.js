(() => {
  'use strict';

  // Same asset pipeline as every other partner logo: a real, standalone
  // transparent PNG on disk, sized through the standard
  // .partner-logo-stage-v20 img rule (max-width/max-height, no forced
  // width/height) so it renders at consistent weight with the rest and any
  // future partner added the same way. There used to be a `wide: true`
  // flag here that forced this logo to a fixed max-width/height via an
  // inline style — that override made this tile's logo overflow its
  // padding (it clipped against the card edge) and was the one thing that
  // could make a future tile diverge in size from the rest; removed.
  const additionalPartners = [{
    brand: 'Diabetes & Desportes',
    category: 'International Partner',
    alt: 'Diabetes & Desportes logo',
    src: '/assets/partners/png/diabetes-desportes-logo.png'
  }];

  const key = value => value.trim().toLocaleLowerCase('en');

  const readTile = tile => {
    const image = tile.querySelector('img');
    const brand = tile.querySelector('strong')?.textContent?.trim()
      || image?.alt?.split(/[—–|-]/)[0]?.trim()
      || 'Partner';
    return {
      brand,
      category: tile.querySelector('span')?.textContent?.trim() || 'Expedition partner',
      alt: image?.alt?.trim() || `${brand} logo`,
      src: image?.getAttribute('src') || ''
    };
  };

  const render = () => {
    const grid = document.querySelector('#trust-partners .trust-partners-grid-v20');
    if (!grid) return;

    const partners = new Map();
    [...grid.querySelectorAll('.partner-tile-v20')]
      .map(readTile)
      .forEach(partner => partners.set(key(partner.brand), partner));
    additionalPartners.forEach(partner => partners.set(key(partner.brand), partner));

    const sorted = [...partners.values()].sort((a, b) =>
      a.brand.localeCompare(b.brand, 'en', { sensitivity: 'base', numeric: true })
    );

    grid.replaceChildren(...sorted.map(partner => {
      const tile = document.createElement('article');
      tile.className = 'partner-tile-v20';
      tile.dataset.partnerBrand = partner.brand;
      tile.setAttribute('aria-label', `${partner.brand}, ${partner.category}`);
      tile.innerHTML = `
        <div class="partner-logo-stage-v20">
          <img src="${partner.src}" alt="${partner.alt}" loading="lazy" decoding="async">
        </div>
        <div class="partner-tile-meta-v20">
          <strong>${partner.brand}</strong>
          <span>${partner.category}</span>
        </div>`;
      return tile;
    }));

    document.documentElement.classList.add('partner-directory-v21');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(render), { once: true });
  } else {
    requestAnimationFrame(render);
  }
})();
