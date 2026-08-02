(() => {
  'use strict';

  const buildGainsSection = () => {
    if (document.body.classList.contains('application-page')) return;
    if (document.querySelector('#expedition-gains')) return;

    const expeditionSection = document.querySelector('#expedition');
    if (!expeditionSection) return;

    const section = document.createElement('section');
    section.className = 'gain-world immersive-panel';
    section.id = 'expedition-gains';
    section.setAttribute('aria-labelledby', 'expedition-gains-title');
    section.innerHTML = `
      <img class="gain-seam gain-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
      <img class="gain-world-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A green Himalayan ravine surrounded by mist and forest" loading="lazy" decoding="async">
      <div class="gain-world-grade" aria-hidden="true"></div>
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
          <p class="kicker">Beyond the trail</p>
          <h2 id="expedition-gains-title">What you gain<br><em>from the expedition.</em></h2>
        </header>

        <div class="gain-grid" aria-label="What participants gain from the expedition">
          <article class="gain-card" data-gain="01">
            <span class="gain-number">01</span>
            <div class="gain-card-copy">
              <h3>Expand your sense of possibility</h3>
              <p>Discover that living with Type 2 diabetes does not have to mean scaling down your ambitions.</p>
            </div>
          </article>

          <article class="gain-card" data-gain="02">
            <span class="gain-number">02</span>
            <div class="gain-card-copy">
              <h3>Become a torchbearer</h3>
              <p>Inspire people living with Type 2 diabetes across the world to take action and achieve better metabolic health.</p>
            </div>
          </article>

          <article class="gain-card gain-card-featured" data-gain="03">
            <span class="gain-number">03</span>
            <div class="gain-card-copy">
              <h3>Build better metabolic health</h3>
              <p>Benefit from 60 days of structured preparation, regular movement and the physical challenge of the trek, all of which may support better metabolic health.</p>
            </div>
          </article>

          <article class="gain-card" data-gain="04">
            <span class="gain-number">04</span>
            <div class="gain-card-copy">
              <h3>Find your support system</h3>
              <p>Connect with like-minded people who understand your journey and encourage you to keep moving forward.</p>
            </div>
          </article>

          <article class="gain-card" data-gain="05">
            <span class="gain-number">05</span>
            <div class="gain-card-copy">
              <h3>Create memories for life</h3>
              <p>Experience adventure, joy and accomplishment while building friendships that may last far beyond the expedition.</p>
            </div>
          </article>
        </div>
      </div>

      <img class="gain-seam gain-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    `;

    expeditionSection.before(section);

    const cards = [...section.querySelectorAll('.gain-card')];
    const heading = section.querySelector('.gain-heading');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      heading?.classList.add('is-visible');
      cards.forEach(card => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

    if (heading) observer.observe(heading);
    cards.forEach((card, index) => {
      card.style.setProperty('--gain-delay', `${index * 70}ms`);
      observer.observe(card);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGainsSection, { once: true });
  } else {
    buildGainsSection();
  }
})();
