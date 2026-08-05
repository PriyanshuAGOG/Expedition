(() => {
  'use strict';

  const rebuildHeroFacts = () => {
    const summary = document.querySelector('.hero-campaign > p');
    if (!summary) return;

    summary.className = 'hero-campaign-summary hero-summary-v15';
    summary.setAttribute('aria-label', '45 days of preparation, World Diabetes Day 2026, six-day Himalayan expedition');
    summary.innerHTML = `
      <span><strong>45 days</strong><small>of preparation</small></span>
      <span><strong>World Diabetes Day</strong><small>2026</small></span>
      <span><strong>6-day</strong><small>Himalayan expedition</small></span>`;
  };

  const rebuildPreparation = () => {
    const section = document.querySelector('#preparation');
    const grid = section?.querySelector('.prep-pillars');
    if (!section || !grid) return;

    section.classList.add('preparation-v15');
    grid.className = 'prep-pillars prep-pillars-v15 reveal visible';
    grid.innerHTML = `
      <article class="prep-card-v15" style="--pillar-art:url('assets/botanicals/webp/58-lichen-stones.webp')">
        <b>01</b>
        <h3>Medical</h3>
        <p>Baseline assessment and final medical clearance.</p>
      </article>
      <article class="prep-card-v15" style="--pillar-art:url('assets/botanicals/webp/59-dew-leaves.webp')">
        <b>02</b>
        <h3>Lifestyle</h3>
        <p>Nutrition, sleep, recovery and sustainable routines that support metabolic health.</p>
      </article>
      <article class="prep-card-v15" style="--pillar-art:url('assets/botanicals/webp/60-flowering-weed.webp')">
        <b>03</b>
        <h3>Fitness &amp; Yoga</h3>
        <p>Progressive walking, strength, mobility, stamina and practical readiness for the trail.</p>
      </article>
      <article class="prep-card-v15" style="--pillar-art:url('assets/botanicals/webp/61-vine-loop.webp')">
        <b>04</b>
        <h3>Mind</h3>
        <p>Stress management, breathwork, meditation and mental preparation.</p>
      </article>
      <article class="prep-card-v15 prep-community-v15" style="--pillar-art:url('assets/botanicals/webp/63-groundcover-strip.webp')">
        <div>
          <b>05</b>
          <h3>Community</h3>
          <p>Group accountability, shared learning, regular check-ins and support throughout the journey.</p>
        </div>
        <span aria-hidden="true"><i></i><strong>Together</strong><small>through every stage</small></span>
      </article>`;
  };

  const gainsMarkup = () => `
    <img class="gain-v15-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A misty Himalayan ravine" loading="lazy" decoding="async">
    <div class="gain-v15-grade" aria-hidden="true"></div>
    <img class="gain-v15-seam gain-v15-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v15-ridge gain-v15-ridge-left" src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v15-ridge gain-v15-ridge-right" src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v15-flora gain-v15-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v15-flora gain-v15-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

    <div class="gain-v15-inner">
      <header class="gain-v15-heading reveal visible">
        <p class="kicker">Beyond the trail</p>
        <h2 id="expedition-gains-title">Key Takeaways from the<br><em>Expedition.</em></h2>
        <p>Five outcomes that continue long after the descent.</p>
      </header>

      <div class="gain-v15-path" role="list" aria-label="What participants gain from the expedition">
        <article class="gain-v15-stop reveal visible" role="listitem">
          <span>01</span>
          <div><small>Possibility</small><h3>Think bigger</h3><p>Type 2 diabetes need not shrink your ambitions.</p></div>
        </article>
        <article class="gain-v15-stop reveal visible" role="listitem">
          <span>02</span>
          <div><small>Influence</small><h3>Lead by example</h3><p>Inspire others to act towards better metabolic health.</p></div>
        </article>
        <article class="gain-v15-stop gain-v15-featured reveal visible" role="listitem">
          <span>03</span>
          <div><small>Metabolic health</small><h3>Build lasting consistency</h3><p>Carry on from where you left off with daily exercise, meditation, and a routine aligned with your circadian rhythm.</p></div>
        </article>
        <article class="gain-v15-stop reveal visible" role="listitem">
          <span>04</span>
          <div><small>Community</small><h3>Find your tribe</h3><p>Build a supportive community and discover how your experience can help others living with diabetes achieve their goals.</p></div>
        </article>
        <article class="gain-v15-stop reveal visible" role="listitem">
          <span>05</span>
          <div><small>Memory</small><h3>Carry the story home</h3><p>Take home friendship, achievements and memories that last beyond the expedition.</p></div>
        </article>
      </div>

      <p class="gain-v15-closing reveal visible">The trail ends. But the rhythm must continue.</p>
    </div>

    <img class="gain-v15-seam gain-v15-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">`;

  const rebuildGains = () => {
    const section = document.querySelector('#expedition-gains');
    if (!section) return;

    section.className = 'gain-world gain-world-v15 immersive-panel';
    section.setAttribute('aria-labelledby', 'expedition-gains-title');
    section.innerHTML = gainsMarkup();
  };

  const tightenSectionJoin = () => {
    document.documentElement.classList.add('final-refinement-v15');
    document.querySelector('#preparation')?.classList.add('section-join-v15');
    document.querySelector('#expedition-gains')?.classList.add('section-join-v15');
  };

  const run = () => {
    rebuildHeroFacts();
    rebuildPreparation();
    rebuildGains();
    tightenSectionJoin();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
