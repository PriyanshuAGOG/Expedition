(() => {
  'use strict';

  const DAYARA_URL = 'https://indiahikes.com/dayara-bugyal-trek';

  const removeNavigation = () => {
    document.querySelectorAll('.floating-nav, [class*="floating-nav"]').forEach(node => node.remove());
    document.documentElement.classList.add('navigation-removed-v14');
  };

  const normaliseCommitment = () => {
    const root = document.body;
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,noscript,textarea,input,select,option')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/75\s*min(?:utes)?/gi, '60 min')
        .replace(/(?:about\s+)?(?:an|one)\s+hour\s+and\s+15\s+minutes/gi, 'approximately one hour');
    });
  };

  const rebuildGlance = () => {
    const grid = document.querySelector('#glance .glance-grid');
    if (!grid) return;

    grid.className = 'glance-grid glance-grid-v14 reveal visible';
    grid.innerHTML = `
      <a class="glance-v14-card glance-v14-route" href="${DAYARA_URL}" target="_blank" rel="noopener">
        <small>Route</small>
        <strong>Dayara Bugyal</strong>
        <span>View route details ↗</span>
      </a>
      <div class="glance-v14-card">
        <small>Altitude</small>
        <strong>7K–12K</strong>
        <span>feet above sea level</span>
      </div>
      <div class="glance-v14-card">
        <small>Expedition</small>
        <strong>6 days</strong>
        <span>four trekking days and two travel days</span>
      </div>
      <div class="glance-v14-card">
        <small>Daily commitment</small>
        <strong>60 min</strong>
        <span>approximately one hour each morning</span>
      </div>
      <div class="glance-v14-card">
        <small>Preparation</small>
        <strong>45 days</strong>
        <span>structured readiness programme</span>
      </div>
      <div class="glance-v14-card glance-v14-experience">
        <small>Experience</small>
        <strong>Not required</strong>
        <span>readiness is built progressively</span>
      </div>`;
  };

  const simplifyPricingHeading = () => {
    const section = document.querySelector('#pricing');
    const heading = section?.querySelector('.fee-v11-heading');
    const title = heading?.querySelector('h2');
    if (!heading || !title) return;

    title.innerHTML = 'A clear programme fee.';
    let stageLine = heading.querySelector('.fee-v14-stage-line');
    if (!stageLine) {
      stageLine = document.createElement('p');
      stageLine.className = 'fee-v14-stage-line';
      title.insertAdjacentElement('afterend', stageLine);
    }
    stageLine.textContent = 'Paid in two stages.';
    section.classList.add('fee-journey-v14');
  };

  const compactItineraryMarkup = () => `
    <section class="itinerary-world-v14 immersive-panel" id="expedition" aria-labelledby="itinerary-v14-title">
      <img class="itinerary-v14-bg" src="assets/sections/webp/11-expedition-team.webp" alt="A trekking group moving through a Himalayan landscape" loading="lazy" decoding="async">
      <div class="itinerary-v14-grade" aria-hidden="true"></div>
      <img class="itinerary-v14-ridge itinerary-v14-ridge-left" src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v14-ridge itinerary-v14-ridge-right" src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v14-flora itinerary-v14-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v14-flora itinerary-v14-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

      <div class="itinerary-v14-inner">
        <header class="itinerary-v14-heading">
          <p class="kicker">The six-day expedition</p>
          <h2 id="itinerary-v14-title">A simple route.<br><em>A deliberate pace.</em></h2>
          <p>An indicative pathway shaped around gradual ascent, recovery, monitoring and safe return. Exact camps and timings may change with weather, permissions and participant readiness.</p>
        </header>

        <div class="itinerary-v14-path" aria-label="Indicative six-day expedition pathway">
          <article><span>01</span><small>Arrive</small><h3>Dehradun to Raithal</h3><p>Travel to basecamp, settle in and complete the expedition briefing.</p></article>
          <article><span>02</span><small>Begin the trail</small><h3>Raithal to Gui</h3><p>A steady forest ascent with controlled pacing and planned recovery stops.</p></article>
          <article><span>03</span><small>Gain altitude</small><h3>Gui to Chilapada</h3><p>A shorter trekking day designed for gradual altitude gain and recovery.</p></article>
          <article class="itinerary-v14-featured"><span>04</span><small>High point</small><h3>Dayara Top and Nayata</h3><p>The main meadow day, adapted in real time to weather and participant condition.</p></article>
          <article><span>05</span><small>Descend</small><h3>Nayata to Raithal</h3><p>A measured return to basecamp followed by rest and reflection.</p></article>
          <article><span>06</span><small>Return</small><h3>Raithal to Dehradun</h3><p>Travel back with recovery guidance and a plan to continue the new habits.</p></article>
        </div>

        <aside class="itinerary-v14-note"><strong>Indicative itinerary.</strong> Final movement decisions remain subject to trail conditions, weather, permissions, medical clearance and the expedition team's safety judgement.</aside>
      </div>
    </section>`;

  const rebuildItinerary = () => {
    const current = document.querySelector('#expedition');
    if (!current) return;
    const holder = document.createElement('div');
    holder.innerHTML = compactItineraryMarkup().trim();
    current.replaceWith(holder.firstElementChild);
  };

  const trimFaqs = () => {
    const list = document.querySelector('#faq .faq-list');
    if (!list) return;
    list.className = 'faq-list faq-list-v14';
    list.innerHTML = `
      <details class="reveal visible"><summary>What happens during the 45 days of preparation?<span>+</span></summary><p>Participants follow an approximately one-hour morning routine of yogic practices, meditation and physical fitness. The programme also builds walking capacity, strength, mobility, consistency and readiness for the trek.</p></details>
      <details class="reveal visible"><summary>Do I need previous trekking experience?<span>+</span></summary><p>No previous Himalayan trekking experience is required. The planned route is suitable for fit beginners, but every participant must complete the preparation programme and receive final medical clearance.</p></details>
      <details class="reveal visible"><summary>What is the Dayara Bugyal route like?<span>+</span></summary><p>The reference route covers about 21 km over four trekking days within a six-day journey. It rises from roughly 7,100 ft to 11,830 ft, with gradual sections as well as some steeper forest and meadow climbs.</p></details>
      <details class="reveal visible"><summary>What fitness level should I work towards?<span>+</span></summary><p>Work towards steady walking endurance, stronger legs and core, better balance, mobility and the ability to recover between active days. Final readiness will be assessed through programme participation, submitted medical information and final medical clearance.</p></details>`;
  };

  const tightenTransitions = () => {
    document.documentElement.classList.add('final-simplification-v14');
    document.querySelector('#preparation')?.classList.add('transition-tight-v14');
    document.querySelector('#expedition-gains')?.classList.add('transition-tight-v14');
    document.querySelector('#pricing')?.classList.add('transition-tight-v14');
    document.querySelectorAll('.leafy-join').forEach(join => join.classList.add('leafy-join-v14'));
  };

  const run = () => {
    removeNavigation();
    normaliseCommitment();
    rebuildGlance();
    simplifyPricingHeading();
    rebuildItinerary();
    trimFaqs();
    tightenTransitions();
    normaliseCommitment();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();