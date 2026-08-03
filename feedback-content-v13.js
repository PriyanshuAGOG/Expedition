(() => {
  'use strict';

  const DAYARA_URL = 'https://indiahikes.com/dayara-bugyal-trek';

  const replaceNode = (selector, html) => {
    const current = document.querySelector(selector);
    if (!current) return null;
    const holder = document.createElement('div');
    holder.innerHTML = html.trim();
    const replacement = holder.firstElementChild;
    current.replaceWith(replacement);
    return replacement;
  };

  const rebuildNavigation = () => {
    const existing = document.querySelector('.floating-nav');
    if (!existing) return;

    const nav = document.createElement('nav');
    nav.className = 'floating-nav floating-nav-v13 nav-v13-dormant';
    nav.setAttribute('aria-label', 'Expedition sections');
    nav.innerHTML = `
      <button class="nav-v13-toggle" type="button" aria-expanded="false" aria-label="Open page navigation">
        <span aria-hidden="true"><i></i><i></i><i></i></span>
      </button>
      <div class="nav-v13-panel">
        <a href="#briefing" aria-label="Purpose">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/></svg><span>Purpose</span>
        </a>
        <a href="#trail" aria-label="Journey">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c2.5-5 4-8 7-8s3.5-4 7-6"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/></svg><span>Journey</span>
        </a>
        <a href="#preparation" aria-label="Preparation">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V10"/><path d="M12 14c-5 0-7-3-7-7 5 0 7 3 7 7zM12 10c0-4 2-7 7-7 0 4-2 7-7 7z"/></svg><span>Preparation</span>
        </a>
        <a href="#safety" aria-label="Safety">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"/><path d="M12 8v7M8.5 11.5h7"/></svg><span>Safety</span>
        </a>
        <a class="nav-v13-apply" href="apply.html" target="_top" aria-label="Apply now">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg><span>Apply</span>
        </a>
      </div>`;

    existing.replaceWith(nav);

    const toggle = nav.querySelector('.nav-v13-toggle');
    let timer = 0;

    const setExpanded = expanded => {
      nav.classList.toggle('nav-v13-expanded', expanded);
      nav.classList.toggle('nav-v13-dormant', !expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Close page navigation' : 'Open page navigation');
    };

    const scheduleClose = (delay = 4200) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setExpanded(false), delay);
    };

    const open = (delay = 4200) => {
      setExpanded(true);
      scheduleClose(delay);
    };

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      if (nav.classList.contains('nav-v13-expanded')) {
        setExpanded(false);
      } else {
        open(6000);
      }
    });

    nav.addEventListener('pointerenter', () => open(6000));
    nav.addEventListener('pointerleave', () => scheduleClose(1100));
    nav.addEventListener('focusin', () => open(6000));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => scheduleClose(350)));
    window.addEventListener('scroll', () => scheduleClose(650), { passive: true });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setExpanded(false);
    });

    setExpanded(false);
  };

  const rebuildGlance = () => {
    const grid = document.querySelector('#glance .glance-grid');
    if (!grid) return;

    grid.className = 'glance-grid glance-grid-v13 reveal visible';
    grid.innerHTML = `
      <a class="glance-v13-card glance-v13-route" href="${DAYARA_URL}" target="_blank" rel="noopener">
        <small>Route</small><strong>Dayara Bugyal</strong><span>View route details ↗</span>
      </a>
      <div class="glance-v13-card glance-v13-partner">
        <small>Trek partner</small><strong>Indiahikes</strong><span>route operations and trail support</span>
      </div>
      <div class="glance-v13-card">
        <small>Altitude</small><strong>7K–12K</strong><span>feet above sea level</span>
      </div>
      <div class="glance-v13-card">
        <small>Expedition</small><strong>6 days</strong><span>2 travel days and 4 trekking days</span>
      </div>
      <div class="glance-v13-card">
        <small>Daily commitment</small><strong>75 min</strong><span>each morning during preparation</span>
      </div>
      <div class="glance-v13-card">
        <small>Preparation</small><strong>45 days</strong><span>structured readiness programme</span>
      </div>
      <div class="glance-v13-card glance-v13-experience">
        <small>Experience</small><strong>Not required</strong><span>readiness is built progressively</span>
      </div>`;
  };

  const itineraryMarkup = () => `
    <section class="itinerary-world-v13 immersive-panel" id="expedition" aria-labelledby="itinerary-v13-title" data-depth-section>
      <img class="itinerary-v13-bg" src="assets/sections/webp/11-expedition-team.webp" alt="A trekking group moving through a green Himalayan valley" loading="lazy" decoding="async">
      <div class="itinerary-v13-grade" aria-hidden="true"></div>
      <div class="itinerary-v13-contours" aria-hidden="true"></div>
      <img class="itinerary-v13-ridge itinerary-v13-ridge-left" src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v13-ridge itinerary-v13-ridge-right" src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v13-flora itinerary-v13-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
      <img class="itinerary-v13-flora itinerary-v13-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

      <div class="itinerary-v13-inner">
        <header class="itinerary-v13-heading v13-reveal">
          <p class="kicker">The six-day expedition pathway</p>
          <h2 id="itinerary-v13-title">From basecamp to meadow,<br><em>one deliberate day at a time.</em></h2>
          <p>This indicative pathway adapts the Dayara Bugyal route around NirogBhumi's preparation, pacing, monitoring and safety principles. Exact camps, timings and trail decisions may change with weather, permissions and participant readiness.</p>
        </header>

        <div class="itinerary-v13-map" aria-label="Indicative six-day itinerary">
          <span class="itinerary-v13-line" aria-hidden="true"></span>

          <article class="itinerary-v13-day itinerary-v13-day-left v13-reveal">
            <div class="itinerary-v13-marker"><span>01</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Arrival and orientation</small>
              <h3>Dehradun to Raithal</h3>
              <div class="itinerary-v13-metrics"><span>Road transfer</span><span>Basecamp · 7.1K ft</span></div>
              <p>Travel to the mountain base, settle in, review the route and complete the first group briefing. The focus is rest, hydration and arriving prepared for the trail.</p>
            </div>
          </article>

          <article class="itinerary-v13-day itinerary-v13-day-right v13-reveal">
            <div class="itinerary-v13-marker"><span>02</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Forest ascent</small>
              <h3>Raithal to Gui</h3>
              <div class="itinerary-v13-metrics"><span>≈ 4.5 km</span><span>≈ 5 hours</span><span>7.1K → 9.6K ft</span></div>
              <p>A steady climb through village fields and oak forest. The group follows a controlled pace with planned hydration, symptom reporting and recovery pauses.</p>
            </div>
          </article>

          <article class="itinerary-v13-day itinerary-v13-day-left v13-reveal">
            <div class="itinerary-v13-marker"><span>03</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Short acclimatisation day</small>
              <h3>Gui to Chilapada</h3>
              <div class="itinerary-v13-metrics"><span>≈ 2.5 km</span><span>≈ 2–3 hours</span><span>9.6K → 10.5K ft</span></div>
              <p>A shorter forest stage allows the group to gain altitude gradually, preserve energy and review how each participant is responding before the longest trail day.</p>
            </div>
          </article>

          <article class="itinerary-v13-day itinerary-v13-day-right itinerary-v13-day-featured v13-reveal">
            <div class="itinerary-v13-marker"><span>04</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Meadow and high point</small>
              <h3>Chilapada to Nayata via Dayara Top</h3>
              <div class="itinerary-v13-metrics"><span>≈ 9.5 km</span><span>≈ 6–7 hours</span><span>High point · 11.8K ft</span></div>
              <p>The defining day moves from forest into the open alpine meadow before a controlled descent. Weather, pace and participant condition determine whether the group continues, modifies the route or turns around.</p>
            </div>
          </article>

          <article class="itinerary-v13-day itinerary-v13-day-left v13-reveal">
            <div class="itinerary-v13-marker"><span>05</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Return through the forest</small>
              <h3>Nayata to Raithal</h3>
              <div class="itinerary-v13-metrics"><span>≈ 4 km</span><span>≈ 4–5 hours</span><span>Descent to 7.1K ft</span></div>
              <p>A measured descent back to basecamp, with attention to footing, fatigue and recovery. The day closes with rest and a structured reflection on the trail experience.</p>
            </div>
          </article>

          <article class="itinerary-v13-day itinerary-v13-day-right v13-reveal">
            <div class="itinerary-v13-marker"><span>06</span><i></i></div>
            <div class="itinerary-v13-card">
              <small>Return and continue</small>
              <h3>Raithal to Dehradun</h3>
              <div class="itinerary-v13-metrics"><span>Road transfer</span><span>Journey close</span></div>
              <p>Return from the mountains with a closing review, practical recovery guidance and a plan to continue the habits built during the 45-day programme.</p>
            </div>
          </article>
        </div>

        <aside class="itinerary-v13-note v13-reveal">
          <span aria-hidden="true">i</span>
          <p><strong>This is an indicative route pathway, not a fixed operational promise.</strong> Final distances, camps, timings and movement decisions remain subject to weather, trail conditions, permissions, medical clearance and the expedition team's safety judgement.</p>
        </aside>
      </div>
    </section>`;

  const rebuildItinerary = () => {
    replaceNode('#expedition', itineraryMarkup());
  };

  const rebuildFaqs = () => {
    const list = document.querySelector('#faq .faq-list');
    if (!list) return;
    list.className = 'faq-list faq-list-v13';
    list.innerHTML = `
      <details class="reveal visible"><summary>What happens during the 45 days of preparation?<span>+</span></summary><p>Participants follow an approximately one-hour morning routine of yogic practices, meditation and physical fitness. The programme also builds walking capacity, strength, mobility, consistency and readiness for the trek.</p></details>
      <details class="reveal visible"><summary>Do I need previous trekking experience?<span>+</span></summary><p>No previous Himalayan trekking experience is required. The planned route is easy-moderate and suitable for fit beginners, but every participant must complete the preparation programme and receive final medical clearance.</p></details>
      <details class="reveal visible"><summary>What is the Dayara Bugyal route like?<span>+</span></summary><p>The reference route covers about 21 km over four trekking days within a six-day journey. It rises from roughly 7,100 ft to 11,830 ft. Much of the trail is gradual, although the initial forest ascent and the approach to the high point can be steep.</p></details>
      <details class="reveal visible"><summary>What fitness level should I work towards?<span>+</span></summary><p>Work towards steady walking endurance, stronger legs and core, better balance, mobility and the ability to recover between active days. Final expedition readiness will be assessed through programme participation, submitted medical information and final medical clearance.</p></details>
      <details class="reveal visible"><summary>What weather should I prepare for?<span>+</span></summary><p>Mountain weather can change quickly. Participants should be prepared for cold mornings and nights, wind, rain or snow, slippery sections and route changes made in the interest of safety.</p></details>
      <details class="reveal visible"><summary>Can altitude sickness happen on this trek?<span>+</span></summary><p>Yes. The route goes above 10,000 ft, where Acute Mountain Sickness can affect first-time and experienced trekkers. Fitness may make walking easier, but it does not remove altitude risk. Symptoms must be reported immediately and all safety instructions must be followed.</p></details>`;
  };

  const removeJournalEntry = () => {
    document.querySelector('#journal .journal-update')?.remove();
  };

  const normaliseAssets = () => {
    document.documentElement.classList.add('final-polish-v13');
    document.querySelectorAll('main > section').forEach(section => section.classList.add('section-v13-audited'));

    const bgSections = ['#glance', '#journal', '#pricing', '#expedition-gains', '#register'];
    bgSections.forEach(selector => document.querySelector(selector)?.classList.add('background-v13-fixed'));

    const glanceHeading = document.querySelector('#glance .glance-heading');
    if (glanceHeading) glanceHeading.classList.add('glance-heading-v13');
  };

  const revealNewContent = () => {
    const nodes = document.querySelectorAll('.v13-reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('v13-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v13-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach((node, index) => {
      node.style.setProperty('--v13-delay', `${Math.min(index % 5, 4) * 55}ms`);
      observer.observe(node);
    });
  };

  const run = () => {
    rebuildNavigation();
    rebuildGlance();
    rebuildItinerary();
    rebuildFaqs();
    removeJournalEntry();
    normaliseAssets();
    revealNewContent();
    document.documentElement.classList.add('feedback-content-v13-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();