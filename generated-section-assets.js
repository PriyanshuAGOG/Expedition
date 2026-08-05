(() => {
  'use strict';

  const ROOT = 'assets/generated/section-art/';
  const page = document.querySelector('main#main-content');
  if (!page || page.dataset.generatedSectionArt === 'ready') return;
  page.dataset.generatedSectionArt = 'ready';
  document.documentElement.classList.add('generated-section-art-v22');

  const wideSeams = [
    ['01-moss-arch-divider.webp', 'center 58%'],
    ['02-canopy-arch-divider.webp', 'center 42%'],
    ['03-rock-ledge-divider.webp', 'center 52%'],
    ['04-misty-forest-floor.webp', 'center 63%'],
    ['05-symmetrical-botanical-divider.webp', 'center 53%'],
    ['09-misty-forest-divider.webp', 'center 58%'],
    ['12-canopy-with-bell.webp', 'center 26%'],
    ['13-riverbank-footer-strip.webp', 'center 61%'],
    ['19-parallax-mountain-layer.webp', 'center 68%']
  ];

  const seamPreference = {
    glance: 0,
    trail: 2,
    preparation: 4,
    expedition: 8,
    safety: 1,
    eligibility: 3,
    journal: 5,
    partners: 6,
    register: 7,
    faq: 1,
    'trust-partners': 4
  };

  const seams = [...page.querySelectorAll('.section-seam')];
  seams.forEach((seam, index) => {
    const host = seam.closest('section');
    const preferred = seamPreference[host?.id];
    const offset = seam.classList.contains('seam-bottom') ? 1 : 0;
    const assetIndex = Number.isInteger(preferred)
      ? (preferred + offset) % wideSeams.length
      : index % wideSeams.length;
    const [filename, position] = wideSeams[assetIndex];

    seam.src = ROOT + filename;
    seam.classList.add('generated-seam');
    seam.dataset.generatedAsset = filename;
    seam.style.setProperty('--generated-seam-position', position);
    seam.loading = 'lazy';
    seam.decoding = 'async';
  });

  // Replace older three-piece joins with a single coherent generated border.
  const joinAssets = [
    '06-hanging-vine-fringe.webp',
    '02-canopy-arch-divider.webp',
    '05-symmetrical-botanical-divider.webp',
    '01-moss-arch-divider.webp'
  ];
  [...page.querySelectorAll('.leafy-join')].forEach((join, index) => {
    join.replaceChildren();
    const image = document.createElement('img');
    image.src = ROOT + joinAssets[index % joinAssets.length];
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    join.appendChild(image);
    join.classList.add('generated-leafy-join');
  });

  const placements = [
    { selector: '#founder-note', file: '10-top-left-rock-flourish.webp', className: 'art-corner art-corner-top-left', depth: -0.025 },
    { selector: '#founder-note', file: '11-bottom-right-fern-flourish.webp', className: 'art-corner art-corner-bottom-right', depth: 0.018 },
    { selector: '#briefing', file: '07-botanical-side-column.webp', className: 'art-side art-side-left art-desktop', depth: -0.02 },
    { selector: '#briefing', file: '15-cascading-vine-wall.webp', className: 'art-side art-side-right art-desktop', depth: 0.025 },
    { selector: '#glance', file: '14-circular-stone-frame.webp', className: 'art-frame art-frame-right', depth: 0.03 },
    { selector: '#trail', file: '17-moss-covered-stone-steps.webp', className: 'art-steps art-bottom-left', depth: -0.018 },
    { selector: '#preparation', file: '16-floating-greenery-cluster.webp', className: 'art-cluster art-top-right', depth: 0.024 },
    { selector: '#expedition', file: '18-mountain-portal-frame.webp', className: 'art-portal art-bottom-right art-desktop', depth: 0.02 },
    { selector: '#eligibility', file: '06-hanging-vine-fringe.webp', className: 'art-fringe art-top-right', depth: -0.015 },
    { selector: '#journal', file: '08-himalayan-mist-archway.webp', className: 'art-mist-arch art-left-center art-desktop', depth: 0.018 },
    { selector: '#journal', file: '19-parallax-mountain-layer.webp', className: 'art-landscape art-landscape-bottom', depth: -0.012 },
    { selector: '#partners', file: '12-canopy-with-bell.webp', className: 'art-canopy art-canopy-top', depth: 0.014 },
    { selector: '#register', file: '15-cascading-vine-wall.webp', className: 'art-side art-side-right art-desktop', depth: 0.022 },
    { selector: '#faq', file: '16-floating-greenery-cluster.webp', className: 'art-cluster art-bottom-right', depth: -0.018 },
    { selector: '#trust-partners', file: '14-circular-stone-frame.webp', className: 'art-frame art-frame-center', depth: 0.012 }
  ];

  const inserted = [];
  placements.forEach(({ selector, file, className, depth }) => {
    const host = document.querySelector(selector);
    if (!host || host.querySelector(`.generated-art[data-generated-file="${file}"]`)) return;

    host.classList.add('generated-art-host');
    const image = document.createElement('img');
    image.src = ROOT + file;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    image.className = `generated-art ${className}`;
    image.dataset.generatedFile = file;
    image.dataset.depth = String(depth);
    host.appendChild(image);
    inserted.push(image);
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { rootMargin: '18% 0px', threshold: 0.01 })
    : null;

  inserted.forEach(image => revealObserver?.observe(image));
  if (!revealObserver) inserted.forEach(image => image.classList.add('is-visible'));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  const updateParallax = () => {
    ticking = false;
    if (reducedMotion.matches || window.innerWidth < 760) {
      inserted.forEach(image => image.style.removeProperty('--generated-shift'));
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    inserted.forEach(image => {
      const host = image.parentElement;
      const rect = host.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const distance = rect.top + rect.height / 2 - viewportCenter;
      const depth = Number(image.dataset.depth || 0);
      const shift = Math.max(-30, Math.min(30, distance * depth));
      image.style.setProperty('--generated-shift', `${shift.toFixed(2)}px`);
    });
  };

  const requestParallax = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax, { passive: true });
  reducedMotion.addEventListener?.('change', requestParallax);
  requestParallax();
})();
