(() => {
  'use strict';

  if (document.body.classList.contains('application-page')) return;

  const ASSETS = {
    fernLeft: 'assets/botanicals/webp/41-fern-corner-left.webp',
    fernRight: 'assets/botanicals/webp/42-fern-corner-right.webp',
    tendril: 'assets/botanicals/webp/48-hanging-tendril.webp',
    fernBorder: 'assets/botanicals/webp/49-fern-vine-border.webp',
    ivy: 'assets/botanicals/webp/50-ivy-vertical.webp',
    seedhead: 'assets/botanicals/webp/55-seedhead-sprig.webp',
    mint: 'assets/botanicals/webp/56-mint-sprig.webp',
    groundcover: 'assets/botanicals/webp/63-groundcover-strip.webp',
    canopy: 'assets/experience/webp/22-canopy-seam.webp',
    terrain: 'assets/experience/webp/23-terrain-seam.webp',
    fernFrame: 'assets/experience/webp/16-fern-frame.webp',
    waterfall: 'assets/experience/webp/13-waterfall-ravine.webp',
    camp: 'assets/experience/webp/15-evening-camp.webp',
    preparation: 'assets/sections/webp/09-preparation.webp',
    team: 'assets/sections/webp/11-expedition-team.webp',
    archive: 'assets/sections/webp/12-research-archive.webp',
    ridgeLeft: 'assets/webp/04-mid-left-valley.webp',
    ridgeRight: 'assets/webp/05-mid-right-valley.webp',
    pinesLeft: 'assets/webp/06-near-left-pines.webp',
    pinesRight: 'assets/webp/07-near-right-pines.webp',
    forestFloor: 'assets/webp/08-foreground-rocks-ferns.webp',
    cloudBank: 'assets/clouds/webp/71-valley-cloud-bank.webp',
    cloudVeil: 'assets/clouds/webp/72-split-cloud-veil.webp',
    fogRibbon: 'assets/clouds/webp/73-foreground-fog-ribbon.webp'
  };

  const PROFILES = [
    { name: 'fern-gateway', left: ASSETS.fernLeft, right: ASSETS.ivy, top: ASSETS.fernBorder, bottom: ASSETS.groundcover, sprig: ASSETS.seedhead, scene: ASSETS.cloudVeil, tone: 'canopy' },
    { name: 'mist-ridge', left: ASSETS.tendril, right: ASSETS.fernRight, top: ASSETS.canopy, bottom: ASSETS.fernBorder, sprig: ASSETS.mint, scene: ASSETS.ridgeLeft, tone: 'ridge-left' },
    { name: 'waterfall-garden', left: ASSETS.ivy, right: ASSETS.tendril, top: ASSETS.terrain, bottom: ASSETS.groundcover, sprig: ASSETS.seedhead, scene: ASSETS.waterfall, tone: 'ravine' },
    { name: 'pine-ascent', left: ASSETS.fernLeft, right: ASSETS.pinesRight, top: ASSETS.fernBorder, bottom: ASSETS.canopy, sprig: ASSETS.mint, scene: ASSETS.ridgeRight, tone: 'ridge-right' },
    { name: 'preparation-clearing', left: ASSETS.fernRight, right: ASSETS.tendril, top: ASSETS.groundcover, bottom: ASSETS.terrain, sprig: ASSETS.seedhead, scene: ASSETS.preparation, tone: 'clearing' },
    { name: 'community-valley', left: ASSETS.fernBorder, right: ASSETS.ivy, top: ASSETS.canopy, bottom: ASSETS.groundcover, sprig: ASSETS.mint, scene: ASSETS.team, tone: 'team' },
    { name: 'forest-descent', left: ASSETS.pinesLeft, right: ASSETS.fernRight, top: ASSETS.terrain, bottom: ASSETS.fernBorder, sprig: ASSETS.seedhead, scene: ASSETS.forestFloor, tone: 'forest-floor' },
    { name: 'field-notes', left: ASSETS.ivy, right: ASSETS.fernLeft, top: ASSETS.groundcover, bottom: ASSETS.canopy, sprig: ASSETS.mint, scene: ASSETS.archive, tone: 'archive' },
    { name: 'high-clouds', left: ASSETS.fernRight, right: ASSETS.fernBorder, top: ASSETS.fernBorder, bottom: ASSETS.terrain, sprig: ASSETS.seedhead, scene: ASSETS.cloudBank, tone: 'clouds' },
    { name: 'expedition-ridge', left: ASSETS.tendril, right: ASSETS.ivy, top: ASSETS.canopy, bottom: ASSETS.groundcover, sprig: ASSETS.mint, scene: ASSETS.pinesLeft, tone: 'pines' },
    { name: 'forest-camp', left: ASSETS.fernLeft, right: ASSETS.fernRight, top: ASSETS.terrain, bottom: ASSETS.fernBorder, sprig: ASSETS.seedhead, scene: ASSETS.camp, tone: 'camp' },
    { name: 'fog-crossing', left: ASSETS.ivy, right: ASSETS.tendril, top: ASSETS.groundcover, bottom: ASSETS.canopy, sprig: ASSETS.mint, scene: ASSETS.fogRibbon, tone: 'fog' },
    { name: 'alpine-frame', left: ASSETS.fernFrame, right: ASSETS.fernRight, top: ASSETS.fernBorder, bottom: ASSETS.terrain, sprig: ASSETS.seedhead, scene: ASSETS.pinesRight, tone: 'alpine' },
    { name: 'quiet-valley', left: ASSETS.fernLeft, right: ASSETS.ivy, top: ASSETS.canopy, bottom: ASSETS.groundcover, sprig: ASSETS.mint, scene: ASSETS.ridgeLeft, tone: 'quiet' },
    { name: 'living-canopy', left: ASSETS.tendril, right: ASSETS.fernBorder, top: ASSETS.terrain, bottom: ASSETS.fernBorder, sprig: ASSETS.seedhead, scene: ASSETS.cloudVeil, tone: 'living' },
    { name: 'summit-garden', left: ASSETS.fernRight, right: ASSETS.fernLeft, top: ASSETS.groundcover, bottom: ASSETS.canopy, sprig: ASSETS.mint, scene: ASSETS.ridgeRight, tone: 'summit' }
  ];

  const PROFILE_BY_ID = {
    'founder-note': 0,
    briefing: 1,
    glance: 2,
    trail: 3,
    preparation: 4,
    'expedition-gains': 5,
    expedition: 6,
    safety: 7,
    eligibility: 8,
    pricing: 9,
    register: 10,
    journal: 11,
    faq: 12,
    partners: 13,
    'trust-partners': 14
  };

  const createImage = (className, src, alt = '') => {
    const image = document.createElement('img');
    image.className = className;
    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    image.addEventListener('error', () => {
      image.hidden = true;
      image.dataset.assetFailed = 'true';
    }, { once: true });
    return image;
  };

  const decorateSection = (section, index) => {
    if (section.id === 'top' || section.querySelector(':scope > .experience-v22-decor')) return;

    const requested = PROFILE_BY_ID[section.id];
    const profileIndex = Number.isInteger(requested) ? requested : index % PROFILES.length;
    const profile = PROFILES[profileIndex];

    section.classList.add('experience-v22-section', `experience-v22-profile-${profileIndex + 1}`);
    section.dataset.experienceProfile = profile.name;
    section.style.setProperty('--v22-section-index', index);

    const decor = document.createElement('div');
    decor.className = `experience-v22-decor experience-v22-tone-${profile.tone}`;
    decor.setAttribute('aria-hidden', 'true');

    decor.append(
      createImage('experience-v22-scene', profile.scene),
      createImage('experience-v22-seam experience-v22-seam-top', profile.top),
      createImage('experience-v22-edge experience-v22-edge-left', profile.left),
      createImage('experience-v22-edge experience-v22-edge-right', profile.right),
      createImage('experience-v22-sprig', profile.sprig),
      createImage('experience-v22-seam experience-v22-seam-bottom', profile.bottom)
    );

    const atmosphere = document.createElement('div');
    atmosphere.className = 'experience-v22-atmosphere';
    atmosphere.innerHTML = '<i></i><i></i><i></i><span></span>';
    decor.appendChild(atmosphere);

    section.prepend(decor);
  };

  const decorateFooter = () => {
    const footer = document.querySelector('.site-footer');
    if (!footer || footer.querySelector(':scope > .experience-v22-footer-crown')) return;
    const crown = document.createElement('div');
    crown.className = 'experience-v22-footer-crown';
    crown.setAttribute('aria-hidden', 'true');
    crown.append(
      createImage('experience-v22-footer-crown-left', ASSETS.fernLeft),
      createImage('experience-v22-footer-crown-center', ASSETS.groundcover),
      createImage('experience-v22-footer-crown-right', ASSETS.fernRight)
    );
    footer.prepend(crown);
  };

  const setResponsiveMode = () => {
    const width = window.innerWidth;
    const mode = width <= 680 ? 'mobile' : width <= 1024 ? 'tablet' : width <= 1440 ? 'laptop' : 'desktop';
    document.documentElement.dataset.experienceViewport = mode;
  };

  const auditLayout = () => {
    const sections = [...document.querySelectorAll('main > section.experience-v22-section')];
    const failures = [];
    const report = sections.map(section => {
      const rect = section.getBoundingClientRect();
      const overflow = section.scrollWidth > Math.ceil(section.clientWidth + 2);
      const failedAssets = section.querySelectorAll('[data-asset-failed="true"]').length;
      if (overflow || failedAssets) failures.push(section.id || section.dataset.experienceProfile);
      return {
        id: section.id || null,
        profile: section.dataset.experienceProfile,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        horizontalOverflow: overflow,
        failedAssets
      };
    });

    window.__EXPEDITION_VISUAL_AUDIT__ = {
      generatedAt: new Date().toISOString(),
      viewport: document.documentElement.dataset.experienceViewport,
      width: window.innerWidth,
      height: window.innerHeight,
      sectionCount: sections.length,
      failures,
      sections: report
    };
    document.documentElement.dataset.experienceAudit = failures.length ? 'review' : 'pass';
  };

  const run = () => {
    const sections = [...document.querySelectorAll('main > section')];
    sections.forEach(decorateSection);
    decorateFooter();
    setResponsiveMode();
    document.documentElement.classList.add('botanical-experience-v22');

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setResponsiveMode();
        auditLayout();
      }, 180);
    }, { passive: true });

    requestAnimationFrame(() => requestAnimationFrame(auditLayout));
  };

  const schedule = () => requestAnimationFrame(() => requestAnimationFrame(run));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();
