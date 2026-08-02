(() => {
  'use strict';

  const buildGainsSection = () => {
    if (document.body.classList.contains('application-page')) return;
    if (document.querySelector('#expedition-gains')) return;

    const expeditionSection = document.querySelector('#expedition');
    if (!expeditionSection) return;

    const section = document.createElement('section');
    section.className = 'gain-world';
    section.id = 'expedition-gains';
    section.setAttribute('aria-labelledby', 'expedition-gains-title');
    section.innerHTML = `
      <img class="gain-seam gain-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
      <img class="gain-world-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A green Himalayan ravine surrounded by mist and forest" loading="lazy" decoding="async">
      <div class="gain-world-grade" aria-hidden="true"></div>
      <div class="gain-ridge-light" aria-hidden="true"></div>
      <div class="gain-mist gain-mist-a" aria-hidden="true"></div>
      <div class="gain-mist gain-mist-b" aria-hidden="true"></div>

      <div class="gain-flora" aria-hidden="true">
        <img class="gain-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
        <img class="gain-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">
        <img class="gain-vine" src="assets/botanicals/webp/49-fern-vine-border.webp" alt="" loading="lazy" decoding="async">
        <img class="gain-groundcover" src="assets/botanicals/webp/63-groundcover-strip.webp" alt="" loading="lazy" decoding="async">
      </div>

      <div class="gain-inner">
        <header class="gain-heading">
          <p class="kicker">What stays with you</p>
          <h2 id="expedition-gains-title">What you gain<br><em>from the expedition.</em></h2>
          <p class="gain-heading-copy">The summit is one moment. What you carry home can shape everything that follows.</p>
        </header>

        <div class="gain-journey" aria-label="What participants gain from the expedition">
          <svg class="gain-route" viewBox="0 0 1000 1720" preserveAspectRatio="none" aria-hidden="true">
            <path class="gain-route-shadow" d="M500 10 C280 170 735 300 510 480 C300 650 710 780 500 950 C300 1120 715 1295 500 1700" />
            <path class="gain-route-line" d="M500 10 C280 170 735 300 510 480 C300 650 710 780 500 950 C300 1120 715 1295 500 1700" />
          </svg>

          <div class="gain-waypoints">
            <article class="gain-waypoint gain-waypoint-left" data-gain="01">
              <div class="gain-marker" aria-hidden="true">
                <span class="gain-marker-halo"></span>
                <img class="gain-stone" src="assets/thresholds-user/01.webp" alt="" loading="lazy" decoding="async">
              </div>
              <div class="gain-waypoint-copy">
                <span class="gain-label">01 · Possibility</span>
                <h3>Expand your sense of possibility</h3>
                <p>Discover that living with Type 2 diabetes does not have to mean scaling down your ambitions.</p>
                <img class="gain-sprig" src="assets/botanicals/webp/55-seedhead-sprig.webp" alt="" loading="lazy" decoding="async">
              </div>
            </article>

            <article class="gain-waypoint gain-waypoint-right" data-gain="02">
              <div class="gain-marker" aria-hidden="true">
                <span class="gain-marker-halo"></span>
                <img class="gain-stone" src="assets/thresholds-user/02.webp" alt="" loading="lazy" decoding="async">
              </div>
              <div class="gain-waypoint-copy">
                <span class="gain-label">02 · Influence</span>
                <h3>Become a torchbearer</h3>
                <p>Inspire people living with Type 2 diabetes across the world to take action and achieve better metabolic health.</p>
                <img class="gain-sprig" src="assets/botanicals/webp/56-mint-sprig.webp" alt="" loading="lazy" decoding="async">
              </div>
            </article>

            <article class="gain-waypoint gain-waypoint-featured" data-gain="03">
              <div class="gain-marker" aria-hidden="true">
                <span class="gain-marker-halo"></span>
                <img class="gain-stone" src="assets/thresholds-user/03.webp" alt="" loading="lazy" decoding="async">
              </div>
              <div class="gain-waypoint-copy">
                <span class="gain-label">03 · Metabolic health</span>
                <h3>Build better metabolic health</h3>
                <p>Benefit from 60 days of structured preparation, regular movement and the physical challenge of the trek, all of which may support better metabolic health.</p>
                <img class="gain-sprig" src="assets/botanicals/webp/59-dew-leaves.webp" alt="" loading="lazy" decoding="async">
              </div>
            </article>

            <article class="gain-waypoint gain-waypoint-left" data-gain="04">
              <div class="gain-marker" aria-hidden="true">
                <span class="gain-marker-halo"></span>
                <img class="gain-stone" src="assets/thresholds-user/04.webp" alt="" loading="lazy" decoding="async">
              </div>
              <div class="gain-waypoint-copy">
                <span class="gain-label">04 · Community</span>
                <h3>Find your support system</h3>
                <p>Connect with like-minded people who understand your journey and encourage you to keep moving forward.</p>
                <img class="gain-sprig" src="assets/botanicals/webp/57-clover-cluster.webp" alt="" loading="lazy" decoding="async">
              </div>
            </article>

            <article class="gain-waypoint gain-waypoint-right" data-gain="05">
              <div class="gain-marker" aria-hidden="true">
                <span class="gain-marker-halo"></span>
                <img class="gain-stone" src="assets/thresholds-user/05.webp" alt="" loading="lazy" decoding="async">
              </div>
              <div class="gain-waypoint-copy">
                <span class="gain-label">05 · Memories</span>
                <h3>Create memories for life</h3>
                <p>Experience adventure, joy and accomplishment while building friendships that may last far beyond the expedition.</p>
                <img class="gain-sprig" src="assets/botanicals/webp/60-flowering-weed.webp" alt="" loading="lazy" decoding="async">
              </div>
            </article>
          </div>
        </div>
      </div>

      <img class="gain-seam gain-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    `;

    expeditionSection.before(section);

    const revealTargets = [
      section.querySelector('.gain-heading'),
      section.querySelector('.gain-route'),
      ...section.querySelectorAll('.gain-waypoint')
    ].filter(Boolean);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      revealTargets.forEach(target => target.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((target, index) => {
      target.style.setProperty('--gain-delay', `${Math.min(index, 6) * 65}ms`);
      observer.observe(target);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGainsSection, { once: true });
  } else {
    buildGainsSection();
  }
})();
