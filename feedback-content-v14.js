(() => {
  'use strict';

  const DAYARA_URL = 'https://indiahikes.com/dayara-bugyal-trek';

  // Same small helper as feedback-content-v3.js's bindSingleOpen — each
  // module IIFE keeps its own copy rather than sharing state, matching
  // this codebase's existing convention (see e.g. CONTACT_EMAIL/
  // CONTACT_PHONE redefined locally in every file that needs them).
  // Needed here specifically because trimFaqs() below replaces
  // .faq-list's innerHTML wholesale, which drops any listeners bound by
  // earlier scripts (v3.js's own updateFaqs() binds this same list, but
  // v12/v13/v14 each rebuild it again afterward with different content).
  const bindSingleOpen = container => {
    container?.querySelectorAll('details').forEach(detail => {
      detail.open = false;
      detail.addEventListener('toggle', () => {
        if (!detail.open) return;
        container.querySelectorAll('details[open]').forEach(other => {
          if (other !== detail) other.open = false;
        });
      });
    });
  };

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

    // Six cards now (was five) — Indiahikes joins as the first, trek-partner
    // card. That makes the grid an even 2-column/3-row rectangle, so the
    // "Trekking Experience" card no longer needs the v18 full-width fold
    // (that fold existed specifically to avoid an odd fifth/sixth card —
    // see feedback-content-v18-launch-polish.css's own comment on
    // .glance-v18-experience). Its Dayara Bugyal link now sits inline at
    // the bottom of a normal-sized card instead of a full-width row.
    grid.className = 'glance-grid glance-grid-v14 glance-grid-v18 reveal visible';
    grid.innerHTML = `
      <div class="glance-v14-card">
        <small>Trek Partner</small>
        <strong>Indiahikes</strong>
        <span>India's safest trekking organisation</span>
      </div>
      <div class="glance-v14-card">
        <small>Expedition</small>
        <strong>6 days</strong>
        <span>four trekking days and two travel days</span>
      </div>
      <div class="glance-v14-card">
        <small>Altitude</small>
        <strong>7K–12K</strong>
        <span>feet above sea level</span>
      </div>
      <div class="glance-v14-card">
        <small>Trekking Experience</small>
        <strong>Not required</strong>
        <span>readiness is built progressively</span>
        <a class="glance-v18-route-link glance-v14-route-link-inline" href="${DAYARA_URL}" target="_blank" rel="noopener" aria-label="View the Dayara Bugyal trek details on Indiahikes">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c2.5-5 4-8 7-8s3.5-4 7-6"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/></svg>
          <span>View Dayara Bugyal Trek Details</span>
        </a>
      </div>
      <div class="glance-v14-card">
        <small>Training Period</small>
        <strong>45 days</strong>
        <span>structured readiness programme</span>
      </div>
      <div class="glance-v14-card">
        <small>Daily commitment</small>
        <strong>60 min</strong>
        <span>approximately one hour each morning</span>
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

  const removeItinerary = () => {
    // The full landing-page itinerary section was removed at the user's
    // request; the Dayara Bugyal trek details remain reachable via the
    // route link inside the "Trekking Experience" glance card.
    document.querySelector('#expedition')?.remove();
  };

  const trimFaqs = () => {
    const list = document.querySelector('#faq .faq-list');
    if (!list) return;
    list.className = 'faq-list faq-list-v14';
    list.innerHTML = `
      <details class="reveal visible"><summary>Why are we doing this?<span>+</span></summary><p>The expedition is designed to explore how structured preparation, daily movement, medical screening, and community support can help people living with Type 2 diabetes or prediabetes build confidence and sustainable routines while preparing for a carefully planned Himalayan trek.</p></details>
      <details class="reveal visible"><summary>What will I gain from this expedition?<span>+</span></summary><p>The experience is intended to help participants build confidence, strengthen daily routines, connect with a supportive community, and carry practical habits such as exercise, meditation, and alignment with the circadian rhythm beyond the expedition. Individual experiences and outcomes may vary.</p></details>
      <details class="reveal visible"><summary>What happens during the 45 days of preparation?<span>+</span></summary><p>Participants follow an approximately one-hour morning routine of yogic practices, meditation and physical fitness. The programme also builds walking capacity, strength, mobility, consistency and readiness for the trek.</p></details>
      <details class="reveal visible"><summary>Do I need previous trekking experience?<span>+</span></summary><p>No previous trekking experience is required. The planned route is suitable for physically fit beginners, but every participant must complete the preparation program and receive final medical clearance.</p></details>
      <details class="reveal visible"><summary>What is the Dayara Bugyal route like?<span>+</span></summary><p>The reference route covers about 21 km over four trekking days within a six-day journey. It rises from roughly 7,100 ft to 11,830 ft, with gradual sections as well as some steeper forest and meadow climbs.</p></details>
      <details class="reveal visible"><summary>What fitness level should I work towards?<span>+</span></summary><p>Work towards steady walking endurance, stronger legs and core, better balance, mobility and the ability to recover between active days. Final readiness will be assessed through programme participation, submitted medical information and final medical clearance.</p></details>`;
    bindSingleOpen(list);
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
    removeItinerary();
    trimFaqs();
    tightenTransitions();
    normaliseCommitment();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();