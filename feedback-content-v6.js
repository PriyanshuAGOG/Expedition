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
      <div class="gain-light gain-light-a" aria-hidden="true"></div>
      <div class="gain-light gain-light-b" aria-hidden="true"></div>
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
          <p class="gain-heading-copy">Five ways the journey can continue shaping your health, confidence and sense of possibility.</p>
        </header>

        <div class="gain-trail" aria-label="What participants gain from the expedition">
          <div class="gain-trail-spine" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>

          <article class="gain-moment gain-moment-left" data-gain="01">
            <div class="gain-panel">
              <span class="gain-number">01</span>
              <div class="gain-card-copy">
                <small>Possibility</small>
                <h3>Expand your sense of possibility</h3>
                <p>Discover that living with Type 2 diabetes does not have to mean scaling down your ambitions.</p>
              </div>
              <img class="gain-card-art gain-card-art-one" src="assets/botanicals/webp/55-seedhead-sprig.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>

          <article class="gain-moment gain-moment-right" data-gain="02">
            <div class="gain-panel">
              <span class="gain-number">02</span>
              <div class="gain-card-copy">
                <small>Leadership</small>
                <h3>Become a torchbearer</h3>
                <p>Inspire people living with Type 2 diabetes across the world to take action and achieve better metabolic health.</p>
              </div>
              <img class="gain-card-art gain-card-art-two" src="assets/botanicals/webp/56-mint-sprig.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>

          <article class="gain-moment gain-moment-featured" data-gain="03">
            <div class="gain-panel">
              <span class="gain-number">03</span>
              <div class="gain-card-copy">
                <small>Metabolic health</small>
                <h3>Build better metabolic health</h3>
                <p>Benefit from 60 days of structured preparation, regular movement and the physical challenge of the trek, all of which may support better metabolic health.</p>
              </div>
              <div class="gain-feature-stat" aria-hidden="true"><strong>60</strong><span>days of preparation</span></div>
              <img class="gain-card-art gain-card-art-three" src="assets/botanicals/webp/59-dew-leaves.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>

          <article class="gain-moment gain-moment-left" data-gain="04">
            <div class="gain-panel">
              <span class="gain-number">04</span>
              <div class="gain-card-copy">
                <small>Community</small>
                <h3>Find your support system</h3>
                <p>Connect with like-minded people who understand your journey and encourage you to keep moving forward.</p>
              </div>
              <img class="gain-card-art gain-card-art-four" src="assets/botanicals/webp/61-vine-loop.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>

          <article class="gain-moment gain-moment-right" data-gain="05">
            <div class="gain-panel">
              <span class="gain-number">05</span>
              <div class="gain-card-copy">
                <small>Memory</small>
                <h3>Create memories for life</h3>
                <p>Experience adventure, joy and accomplishment while building friendships that may last far beyond the expedition.</p>
              </div>
              <img class="gain-card-art gain-card-art-five" src="assets/botanicals/webp/53-white-wildflowers.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>
        </div>
      </div>

      <img class="gain-seam gain-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    `;

    expeditionSection.before(section);

    const moments = [...section.querySelectorAll('.gain-moment')];
    const heading = section.querySelector('.gain-heading');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    moments.forEach((moment, index) => {
      moment.style.setProperty('--gain-delay', `${index * 85}ms`);
    });

    if (reducedMotion || !('IntersectionObserver' in window)) {
      heading?.classList.add('is-visible');
      moments.forEach(moment => moment.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

    if (heading) observer.observe(heading);
    moments.forEach(moment => observer.observe(moment));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGainsSection, { once: true });
  } else {
    buildGainsSection();
  }
})();
