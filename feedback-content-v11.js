(() => {
  'use strict';

  const CONTACT_EMAIL = 'priyanshu@nirogbhumi.com';
  const CONTACT_PHONE = '+919588810249';
  const CONTACT_PHONE_DISPLAY = '+91 95888 10249';
  const WEBSITE = 'https://nirogbhumi.com';

  const pricingMarkup = () => `
    <section class="fee-journey fee-journey-v11 immersive-panel" id="pricing" aria-labelledby="fee-v11-title">
      <img class="fee-v11-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A green Himalayan valley rising through mist" loading="lazy" decoding="async">
      <div class="fee-v11-grade" aria-hidden="true"></div>
      <img class="fee-v11-seam fee-v11-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
      <img class="fee-v11-flora fee-v11-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
      <img class="fee-v11-flora fee-v11-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

      <div class="fee-v11-inner">
        <header class="fee-v11-heading v11-reveal">
          <p class="kicker">Your participation journey</p>
          <h2 id="fee-v11-title">A clear programme fee,<br><em>paid in two stages.</em></h2>
          <p>Application is free. Payment begins only after selection into the 60-day programme, and the expedition-stage fee is payable only after final medical clearance.</p>
        </header>

        <div class="fee-v11-overview v11-reveal" aria-label="Programme fee overview">
          <div><small>Application</small><strong>₹0</strong><span>No payment required</span></div>
          <div><small>60-day programme</small><strong>₹30,000</strong><span>Inclusive of applicable GST</span></div>
          <div><small>Expedition stage</small><strong>₹19,500</strong><span>Only after medical clearance</span></div>
          <div class="fee-v11-total"><small>Total if cleared</small><strong>₹49,500</strong><span>Inclusive of applicable GST</span></div>
        </div>

        <aside class="fee-v18-cost-card v11-reveal" aria-label="Medical tests and personal health costs">
          <span class="fee-v18-cost-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/></svg></span>
          <div>
            <small>Medical tests and personal health costs</small>
            <p>All prescribed laboratory tests, diagnostic investigations, medical consultations, certificates, medications and health-monitoring devices must be arranged locally and paid for directly by the participant. Nirog Bhumi will not conduct or pay for these tests.</p>
          </div>
        </aside>

        <aside class="fee-v11-final-note v11-reveal">
          <span aria-hidden="true">i</span>
          <p><strong>Admission to the 45-day programme does not guarantee expedition eligibility.</strong> <strong>Final participation is subject to medical clearance.</strong> Full terms: <a href="policies/programme-fee-payments.html">Programme Fee &amp; Payments</a> and <a href="policies/cancellation-refunds.html">Cancellation, Refunds &amp; Changes</a>.</p>
        </aside>
      </div>

      <img class="fee-v11-seam fee-v11-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    </section>`;

  const rebuildPricing = () => {
    const registration = document.querySelector('#register');
    if (!registration) return;
    document.querySelector('#pricing')?.remove();
    registration.insertAdjacentHTML('beforebegin', pricingMarkup());
  };

  const gainsMarkup = () => `
    <img class="gain-v11-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A misty green Himalayan ravine" loading="lazy" decoding="async">
    <div class="gain-v11-grade" aria-hidden="true"></div>
    <div class="gain-v11-contours" aria-hidden="true"></div>
    <img class="gain-v11-seam gain-v11-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v11-mountain gain-v11-mountain-left" src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v11-mountain gain-v11-mountain-right" src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">

    <div class="gain-v11-inner">
      <header class="gain-v11-heading v11-reveal">
        <p class="kicker">Beyond the trail</p>
        <h2 id="expedition-gains-title">What you carry home<br><em>from the expedition.</em></h2>
        <p>Five outcomes arranged like elevation notes on a mountain map, moving from possibility to lasting memory.</p>
      </header>

      <div class="gain-v11-map" role="list" aria-label="What participants gain from the expedition">
        <div class="gain-v11-crest" aria-hidden="true">
          <span>Beyond<br>the trail</span>
          <i></i><i></i><i></i>
        </div>

        <article class="gain-v11-note gain-v11-note-1 v11-reveal" role="listitem">
          <div class="gain-v11-index"><span>01</span><i></i></div>
          <div><small>Possibility</small><h3>Expand your sense of possibility</h3><p>Discover that living with Type 2 diabetes does not have to mean scaling down your ambitions.</p></div>
        </article>

        <article class="gain-v11-note gain-v11-note-2 v11-reveal" role="listitem">
          <div class="gain-v11-index"><span>02</span><i></i></div>
          <div><small>Influence</small><h3>Become a torchbearer</h3><p>Inspire people living with Type 2 diabetes across the world to take action and achieve better metabolic health.</p></div>
        </article>

        <article class="gain-v11-note gain-v11-note-3 v11-reveal" role="listitem">
          <div class="gain-v11-index"><span>03</span><i></i></div>
          <div><small>Metabolic health</small><h3>Build better metabolic health</h3><p>Benefit from 60 days of structured preparation, regular movement and the physical challenge of the trek, all of which may support better metabolic health.</p></div>
        </article>

        <article class="gain-v11-note gain-v11-note-4 v11-reveal" role="listitem">
          <div class="gain-v11-index"><span>04</span><i></i></div>
          <div><small>Community</small><h3>Find your support system</h3><p>Connect with like-minded people who understand your journey and encourage you to keep moving forward.</p></div>
        </article>

        <article class="gain-v11-note gain-v11-note-5 v11-reveal" role="listitem">
          <div class="gain-v11-index"><span>05</span><i></i></div>
          <div><small>Memories</small><h3>Create memories for life</h3><p>Experience adventure, joy and accomplishment while building friendships that may last far beyond the expedition.</p></div>
        </article>
      </div>

      <div class="gain-v11-closing v11-reveal"><span></span><p>What begins on the mountain can reshape what feels possible at home.</p><span></span></div>
    </div>

    <img class="gain-v11-flora gain-v11-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v11-flora gain-v11-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v11-seam gain-v11-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">`;

  const rebuildGains = () => {
    const section = document.querySelector('#expedition-gains');
    if (!section) return;
    section.className = 'gain-world gain-world-v11 immersive-panel';
    section.setAttribute('aria-labelledby', 'expedition-gains-title');
    section.innerHTML = gainsMarkup();
  };

  const footerMarkup = () => `
    <img class="footer-v11-bg" src="assets/experience/webp/15-evening-camp.webp" alt="A quiet Himalayan forest camp at blue hour" loading="lazy" decoding="async">
    <div class="footer-v11-grade" aria-hidden="true"></div>
    <img class="footer-v11-seam" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">

    <div class="footer-v11-inner">
      <div class="footer-v11-brand">
        <img src="assets/branding/webp/nirogbhumi-wordmark.webp" alt="Nirog Bhumi" width="900" height="206" loading="lazy" decoding="async">
        <div><strong>World Diabetes Day Himalayan Expedition 2026</strong><span>Jaipur, Rajasthan · India</span></div>
      </div>

      <div class="footer-v11-links" aria-label="Contact and website links">
        <a href="${WEBSITE}" target="_blank" rel="noopener"><small>Website</small><strong>nirogbhumi.com</strong></a>
        <a href="mailto:${CONTACT_EMAIL}"><small>Email</small><strong>${CONTACT_EMAIL}</strong></a>
        <a href="tel:${CONTACT_PHONE}"><small>Phone</small><strong>${CONTACT_PHONE_DISPLAY}</strong></a>
        <a href="https://wa.me/${CONTACT_PHONE.replace('+', '')}" target="_blank" rel="noopener"><small>WhatsApp</small><strong>Message the team</strong></a>
      </div>

      <div class="footer-v11-actions">
        <nav aria-label="Footer navigation"><a href="#briefing">Purpose</a><a href="#trail">Journey</a><a href="#safety">Safety</a><a href="#faq">FAQs</a><a href="policies/index.html">Policies</a><a href="consent-withdrawal.html">Privacy &amp; Consent</a></nav>
        <a class="footer-v11-apply" href="apply.html" target="_top">Apply Now</a>
      </div>

      <p class="footer-v11-disclaimer">Nirog Bhumi does not replace medical advice, diagnosis, emergency care or treatment. Speak with your treating physician before changing medication, diet or physical activity.</p>

      <div class="footer-v11-bottom"><span>© 2026 Nirog Bhumi</span><a href="${WEBSITE}" target="_blank" rel="noopener">nirogbhumi.com</a></div>
    </div>`;

  const rebuildFooter = () => {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    footer.className = 'site-footer footer-v11';
    footer.innerHTML = footerMarkup();
  };

  const prepareNavigation = () => {
    const nav = document.querySelector('.floating-nav');
    if (!nav || nav.classList.contains('floating-nav-v11')) return;
    nav.classList.add('floating-nav-v11');

    const toggle = document.createElement('button');
    toggle.className = 'floating-nav-toggle-v11';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open page navigation');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = '<span aria-hidden="true"><i></i><i></i><i></i></span>';
    nav.prepend(toggle);

    let timer = 0;
    const setExpanded = expanded => {
      nav.classList.toggle('nav-expanded-v11', expanded);
      nav.classList.toggle('nav-dormant-v11', !expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Close page navigation' : 'Open page navigation');
    };
    const scheduleDormant = (delay = 3600) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setExpanded(false), delay);
    };
    const activate = () => {
      setExpanded(true);
      scheduleDormant();
    };

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const next = nav.classList.contains('nav-dormant-v11');
      setExpanded(next);
      if (next) scheduleDormant(5200);
    });
    nav.addEventListener('pointerenter', activate);
    nav.addEventListener('focusin', activate);
    nav.addEventListener('pointerleave', () => scheduleDormant(1200));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => scheduleDormant(500)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setExpanded(false);
    });
    window.addEventListener('scroll', () => scheduleDormant(900), { passive: true });

    setExpanded(true);
    scheduleDormant(2600);
  };

  const normaliseSectionAssets = () => {
    document.documentElement.classList.add('final-production-v11');
    document.querySelectorAll('main > section').forEach(section => section.classList.add('section-v11-audited'));
    document.querySelectorAll('.section-seam, [class*="-seam-top"], [class*="-seam-bottom"]').forEach(asset => asset.setAttribute('aria-hidden', 'true'));
  };

  const observe = () => {
    const elements = [...document.querySelectorAll('.v11-reveal')];
    if (!elements.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('v11-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('v11-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--v11-delay', `${Math.min(index * 38, 220)}ms`);
      observer.observe(element);
    });
  };

  const run = () => {
    if (document.body.classList.contains('application-page')) return;
    rebuildGains();
    rebuildPricing();
    rebuildFooter();
    prepareNavigation();
    normaliseSectionAssets();
    observe();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
