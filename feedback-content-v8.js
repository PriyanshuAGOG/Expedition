(() => {
  'use strict';

  const CONTACT_EMAIL = 'priyanshu@nirogbhumi.com';

  const heroMarkup = () => `
    <span class="hero-summary-item hero-summary-preparation">
      <b>60 days</b><small>of preparation</small>
    </span>
    <span class="hero-summary-item hero-summary-date">
      <b>World Diabetes Day</b><small>2026</small>
    </span>
    <span class="hero-summary-item hero-summary-expedition">
      <b>6-day</b><small>Himalayan expedition</small>
    </span>`;

  const updateHeroSummary = () => {
    const summary = document.querySelector('.hero-campaign > p');
    if (!summary) return;
    summary.className = 'hero-campaign-summary hero-campaign-summary-v8';
    summary.innerHTML = heroMarkup();
  };

  const pricingMarkup = () => `
    <section class="fee-journey immersive-panel" id="pricing" aria-labelledby="fee-journey-title">
      <img class="fee-journey-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A green Himalayan valley rising through mist" loading="lazy" decoding="async">
      <div class="fee-journey-grade" aria-hidden="true"></div>
      <img class="fee-journey-seam fee-journey-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
      <img class="fee-journey-fern fee-journey-fern-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
      <img class="fee-journey-fern fee-journey-fern-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

      <div class="fee-journey-inner">
        <header class="fee-journey-heading v8-reveal">
          <p class="kicker">A transparent path forward</p>
          <h2 id="fee-journey-title">Your participation journey<br><em>and programme fee.</em></h2>
          <p>Here is a clear breakdown of the costs and what is included at each stage of the journey towards the Himalayan expedition.</p>
        </header>

        <div class="fee-stage-grid">
          <article class="fee-stage fee-stage-primary v8-reveal">
            <div class="fee-stage-topline"><span>Stage 01</span><small>Preparatory programme</small></div>
            <div class="fee-stage-price"><strong>₹30,000</strong><span>inclusive of applicable GST</span></div>
            <p class="fee-stage-qualifier">Payable by every applicant who is selected to join the preparatory programme.</p>
            <div class="fee-stage-includes">
              <h3>What this stage includes</h3>
              <ul>
                <li>Structured 60-day online preparation</li>
                <li>Fitness, yoga, walking, strength, mobility and endurance development</li>
                <li>Nutrition, sleep, stress-management and habit-transformation guidance</li>
                <li>Community meetings and participant support</li>
                <li>Review of participant-submitted reports by the designated medical team or consultant</li>
                <li>Progress and expedition-readiness assessment</li>
                <li>Final medical-clearance review</li>
              </ul>
            </div>
            <div class="fee-stage-exclusion">
              <strong>Arranged separately by the participant</strong>
              <p>All prescribed laboratory tests, diagnostic investigations, medical consultations, certificates, medications and health-monitoring devices must be arranged locally and paid for directly by the participant. NirogBhumi will not conduct or pay for these tests.</p>
            </div>
          </article>

          <article class="fee-stage fee-stage-expedition v8-reveal">
            <div class="fee-stage-topline"><span>Stage 02</span><small>Complete programme and expedition</small></div>
            <div class="fee-stage-price"><strong>₹19,500</strong><span>inclusive of applicable GST</span></div>
            <p class="fee-stage-qualifier">Payable by participants who complete the preparatory programme, receive final medical clearance and join the Himalayan expedition.</p>
            <div class="fee-clearance-note">
              <span>Medical-clearance safeguard</span>
              <h3>Not medically cleared after the 60-day programme?</h3>
              <p>No expedition-stage payment will be required. The participant's total programme fee will remain ₹30,000 inclusive of applicable GST.</p>
            </div>
            <div class="fee-stage-landscape" aria-hidden="true">
              <img src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
              <img src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">
            </div>
          </article>
        </div>

        <section class="payment-path v8-reveal" aria-labelledby="payment-path-title">
          <header>
            <p class="kicker">When do you pay?</p>
            <h3 id="payment-path-title">Three decisions.<br><em>No hidden stage.</em></h3>
          </header>
          <ol class="payment-path-list">
            <li>
              <span class="payment-marker">01</span>
              <div><small>Application</small><strong>No payment required</strong><p>Submit your expression of interest and basic health information.</p></div>
            </li>
            <li>
              <span class="payment-marker">02</span>
              <div><small>Admission to the 60-day programme</small><strong>₹30,000 <i>inclusive of GST</i></strong><p>Payable upon acceptance. Covers the complete 60-day online programme, participant support and medical-readiness assessment.</p></div>
            </li>
            <li>
              <span class="payment-marker">03</span>
              <div><small>Final medical clearance</small><strong>A conditional final balance</strong><p><b>If cleared:</b> the remaining ₹19,500 inclusive of GST is payable. <b>If not cleared:</b> no further payment is required and the total fee remains ₹30,000.</p></div>
            </li>
          </ol>
        </section>

        <div class="fee-final-note v8-reveal">
          <span aria-hidden="true">!</span>
          <p><strong>Admission to the 60-day programme does not guarantee expedition eligibility.</strong> Final participation is subject to medical clearance.</p>
        </div>
      </div>

      <img class="fee-journey-seam fee-journey-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    </section>`;

  const rebuildPricing = () => {
    document.querySelector('#pricing')?.remove();
    const registration = document.querySelector('#register');
    if (!registration) return;
    registration.insertAdjacentHTML('beforebegin', pricingMarkup());
  };

  const gainsMarkup = () => `
    <img class="gain-v8-bg" src="assets/experience/webp/13-waterfall-ravine.webp" alt="A misty Himalayan ravine" loading="lazy" decoding="async">
    <div class="gain-v8-grade" aria-hidden="true"></div>
    <div class="gain-v8-contours" aria-hidden="true"></div>
    <img class="gain-v8-seam gain-v8-seam-top" src="assets/experience/webp/23-terrain-seam.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v8-mountain gain-v8-mountain-left" src="assets/webp/04-mid-left-valley.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v8-mountain gain-v8-mountain-right" src="assets/webp/05-mid-right-valley.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v8-flora gain-v8-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v8-flora gain-v8-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

    <div class="gain-v8-inner">
      <header class="gain-v8-heading v8-reveal">
        <p class="kicker">Beyond the trail</p>
        <h2 id="expedition-gains-title">What you gain<br><em>from the expedition.</em></h2>
        <p>The expedition is one summit. The confidence, habits, community and memories you carry home can continue far beyond it.</p>
      </header>

      <div class="gain-v8-ridge-map" role="list" aria-label="What participants gain from the expedition">
        <div class="gain-v8-spine" aria-hidden="true"><i></i><i></i><i></i></div>

        <article class="gain-v8-ridge gain-v8-ridge-left v8-reveal" role="listitem">
          <span class="gain-v8-marker"><b>01</b><i></i></span>
          <div class="gain-v8-copy"><small>Possibility</small><h3>Expand your sense of possibility</h3><p>Discover that living with Type 2 diabetes does not have to mean scaling down your ambitions.</p></div>
        </article>

        <article class="gain-v8-ridge gain-v8-ridge-right v8-reveal" role="listitem">
          <span class="gain-v8-marker"><b>02</b><i></i></span>
          <div class="gain-v8-copy"><small>Influence</small><h3>Become a torchbearer</h3><p>Inspire people living with Type 2 diabetes across the world to take action and achieve better metabolic health.</p></div>
        </article>

        <article class="gain-v8-ridge gain-v8-ridge-summit v8-reveal" role="listitem">
          <span class="gain-v8-marker"><b>03</b><i></i></span>
          <div class="gain-v8-copy"><small>Metabolic health</small><h3>Build better metabolic health</h3><p>Benefit from 60 days of structured preparation, regular movement and the physical challenge of the trek, all of which may support better metabolic health.</p></div>
        </article>

        <article class="gain-v8-ridge gain-v8-ridge-left v8-reveal" role="listitem">
          <span class="gain-v8-marker"><b>04</b><i></i></span>
          <div class="gain-v8-copy"><small>Community</small><h3>Find your support system</h3><p>Connect with like-minded people who understand your journey and encourage you to keep moving forward.</p></div>
        </article>

        <article class="gain-v8-ridge gain-v8-ridge-right v8-reveal" role="listitem">
          <span class="gain-v8-marker"><b>05</b><i></i></span>
          <div class="gain-v8-copy"><small>Memories</small><h3>Create memories for life</h3><p>Experience adventure, joy and accomplishment while building friendships that may last far beyond the expedition.</p></div>
        </article>
      </div>

      <div class="gain-v8-summit-line v8-reveal"><span></span><p>What begins on the mountain can reshape what feels possible at home.</p><span></span></div>
    </div>

    <img class="gain-v8-groundcover" src="assets/botanicals/webp/63-groundcover-strip.webp" alt="" loading="lazy" decoding="async">
    <img class="gain-v8-seam gain-v8-seam-bottom" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">`;

  const rebuildGains = () => {
    const section = document.querySelector('#expedition-gains');
    if (!section) return;
    section.className = 'gain-world gain-world-v8 immersive-panel';
    section.setAttribute('aria-labelledby', 'expedition-gains-title');
    section.innerHTML = gainsMarkup();
  };

  const nominationDialogMarkup = () => `
    <dialog class="nomination-dialog" id="nomination-dialog" aria-labelledby="nomination-dialog-title">
      <div class="nomination-dialog-shell">
        <button class="nomination-dialog-close" type="button" data-close-nomination aria-label="Close nomination form">×</button>
        <div class="nomination-dialog-visual" aria-hidden="true">
          <img src="assets/sections/webp/11-expedition-team.webp" alt="" loading="lazy" decoding="async">
          <div></div>
          <span>Nominate someone<br>for the journey.</span>
        </div>
        <form class="nomination-dialog-form">
          <p class="kicker">Nominate someone</p>
          <h2 id="nomination-dialog-title">A small introduction<br><em>can open a new path.</em></h2>
          <p>Share their basic contact details and our team will follow up.</p>
          <label><span>Name *</span><input name="nomineeName" autocomplete="name" required></label>
          <label><span>Email <small>(optional)</small></span><input type="email" name="nomineeEmail" autocomplete="email"></label>
          <label><span>Phone *</span><input type="tel" name="nomineePhone" autocomplete="tel" required></label>
          <label class="hp-field" aria-hidden="true" tabindex="-1"><span>Leave this field blank</span><input type="text" name="companyWebsite" tabindex="-1" autocomplete="off"></label>
          <output class="nomination-dialog-status" aria-live="polite"></output>
          <button class="nomination-dialog-submit" type="submit">Submit Nomination <i>↗</i></button>
        </form>
      </div>
    </dialog>`;

  const nominationCardMarkup = () => `
    <article class="onboard-path nomination-trigger-card reveal visible">
      <span>02</span>
      <h3>Nominate someone</h3>
      <p>Recommend a person living with Type 2 diabetes or prediabetes.</p>
      <button type="button" data-open-nomination>Nominate Now <i>↗</i></button>
    </article>`;

  const bindNominationDialog = dialog => {
    if (!dialog || dialog.dataset.bound === 'true') return;
    dialog.dataset.bound = 'true';

    const form = dialog.querySelector('.nomination-dialog-form');
    const close = () => dialog.close();

    document.querySelectorAll('[data-open-nomination]').forEach(button => {
      button.addEventListener('click', () => dialog.showModal());
    });
    dialog.querySelectorAll('[data-close-nomination]').forEach(button => button.addEventListener('click', close));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) close();
    });

    form?.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('nomineeName') || '').trim();
      const email = String(data.get('nomineeEmail') || '').trim();
      const phone = String(data.get('nomineePhone') || '').trim();
      const status = form.querySelector('.nomination-dialog-status');
      const submitButton = form.querySelector('.nomination-dialog-submit');
      const mailtoFallback = () => {
        const subject = encodeURIComponent('Nomination for World Diabetes Day Himalayan Expedition 2026');
        const body = encodeURIComponent(`Nominee name: ${name}\nNominee email: ${email || 'Not provided'}\nNominee phone: ${phone}\n\nI would like to nominate this person for the expedition.`);
        if (status) status.textContent = 'Opening your email app…';
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      };
      submitButton && (submitButton.disabled = true);
      if (status) status.textContent = 'Submitting…';
      import('./assets/js/appwrite-client.js').then(({ submitForm }) => submitForm('nominations', {
        nomineeName: name, nomineeEmail: email || undefined, nomineePhone: phone,
      }, { honeypot: data.get('companyWebsite') })).then(() => {
        if (status) status.textContent = 'Thank you — we have received this nomination.';
        setTimeout(() => { form.reset(); close(); if (status) status.textContent = ''; }, 1800);
      }).catch(() => {
        // Backend unavailable or not yet configured — fall back to the
        // original mailto behaviour so the nomination still reaches someone.
        mailtoFallback();
      }).finally(() => {
        submitButton && (submitButton.disabled = false);
      });
    });
  };

  const rebuildNomination = () => {
    const paths = document.querySelector('#partners .onboard-paths');
    if (!paths) return;

    const nomination = [...paths.children].find(card => /nominate someone/i.test(card.querySelector('h3')?.textContent || ''));
    if (nomination) nomination.outerHTML = nominationCardMarkup();

    paths.classList.add('onboard-paths-equal-v8');
    [...paths.children].forEach(card => card.classList.add('onboard-path-v8'));

    if (!document.querySelector('#nomination-dialog')) {
      document.body.insertAdjacentHTML('beforeend', nominationDialogMarkup());
    }
    bindNominationDialog(document.querySelector('#nomination-dialog'));
  };

  const observeV8 = () => {
    const elements = [...document.querySelectorAll('.v8-reveal')];
    if (!elements.length) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('v8-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('v8-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--v8-delay', `${Math.min(index * 45, 260)}ms`);
      observer.observe(element);
    });
  };

  const run = () => {
    if (document.body.classList.contains('application-page')) return;
    updateHeroSummary();
    rebuildGains();
    rebuildPricing();
    rebuildNomination();
    observeV8();
    document.documentElement.classList.add('feedback-content-v8-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
