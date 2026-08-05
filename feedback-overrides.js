(() => {
  'use strict';

  const CANONICAL_NAME = 'World Diabetes Day Himalayan Expedition 2026';
  const PROGRAMME_CONTACT = 'nirogbhumi@gmail.com';
  const PROGRAMME_PHONE = '+91 73575 42882';

  const replaceProgrammeName = value => {
    if (typeof value !== 'string' || !value) return value;
    return value
      .replaceAll('World%20Diabetes%20Day%20Expedition%202026', 'World%20Diabetes%20Day%20Himalayan%20Expedition%202026')
      .replaceAll('World%20Diabetes%20Day%20Expedition', 'World%20Diabetes%20Day%20Himalayan%20Expedition')
      .replaceAll('World Diabetes Day Expedition 2026', CANONICAL_NAME)
      .replaceAll('World Diabetes Day Expedition', 'World Diabetes Day Himalayan Expedition');
  };

  const harmoniseProgrammeName = root => {
    const scope = root || document.body;
    if (!scope) return;

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.matches('script, style, textarea, option')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue?.includes('World Diabetes Day Expedition')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => { node.nodeValue = replaceProgrammeName(node.nodeValue); });

    document.querySelectorAll('[href], [aria-label], [title], [content]').forEach(element => {
      ['href', 'aria-label', 'title', 'content'].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        const current = element.getAttribute(attribute);
        const updated = replaceProgrammeName(current);
        if (updated !== current) element.setAttribute(attribute, updated);
      });
    });

    document.title = document.body.classList.contains('application-page')
      ? `Apply · ${CANONICAL_NAME} · Nirog Bhumi`
      : `${CANONICAL_NAME} · Nirog Bhumi`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = document.body.classList.contains('application-page')
        ? `Apply for Nirog Bhumi's ${CANONICAL_NAME}.`
        : `Learn about Nirog Bhumi's ${CANONICAL_NAME}, including preparation, eligibility, safety and the application process.`;
    }
  };

  const updateLandingCopy = () => {
    const heroOverview = document.querySelector('.hero-campaign > p');
    if (heroOverview) {
      heroOverview.innerHTML = '<strong>60 days of preparation</strong> · 6 day Himalayan expedition · World Diabetes Day 2026';
    }

    const purposeTitle = document.querySelector('#briefing-title');
    if (purposeTitle) purposeTitle.innerHTML = 'Why we are <em>doing</em> this?';
  };

  const pricingConfig = window.NIROGBHUMI_PRICING || {
    fee: null,
    currency: 'INR',
    status: 'Pricing under final review',
    note: 'No payment is collected with the application.',
    lastUpdated: '2026-08-01T00:00:00+05:30'
  };
  window.NIROGBHUMI_PRICING = pricingConfig;

  const formatProgrammeFee = config => {
    const hasApprovedFee = typeof config.fee === 'number' && Number.isFinite(config.fee) && config.fee >= 0;
    if (!hasApprovedFee) return 'To be announced';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: config.currency || 'INR',
      maximumFractionDigits: 0
    }).format(config.fee);
  };

  const pricingMarkup = () => `
    <section class="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div class="pricing-inner">
        <header class="pricing-heading">
          <p class="kicker">Programme pricing</p>
          <h2 id="pricing-title">A clear fee,<br><em>published here.</em></h2>
          <p>The approved programme price will update automatically everywhere it appears on this page. Until it is formally published, no amount is being presented as final.</p>
        </header>
        <div class="pricing-panel" aria-live="polite">
          <div class="pricing-current">
            <span class="pricing-state" data-pricing-status>Pricing under final review</span>
            <strong data-programme-fee>To be announced</strong>
            <p data-pricing-note>No payment is collected with the application.</p>
            <small>Last updated <time data-pricing-updated>1 August 2026</time></small>
          </div>
          <div class="pricing-details">
            <h3>Before any payment is requested</h3>
            <p>The final pricing disclosure will clearly state:</p>
            <ul>
              <li>The approved fee and applicable taxes</li>
              <li>Included preparation and expedition services</li>
              <li>Travel, equipment and other exclusions</li>
              <li>Payment schedule, cancellation and refund terms</li>
            </ul>
          </div>
        </div>
      </div>
    </section>`;

  const ensurePricingSection = () => {
    if (document.querySelector('#pricing')) return;
    const journey = document.querySelector('#trail');
    if (!journey) return;
    journey.insertAdjacentHTML('beforebegin', pricingMarkup());
  };

  const configureExistingPricingCards = () => {
    const glanceFee = document.querySelector('.glance-fee');
    if (glanceFee) {
      glanceFee.innerHTML = '<small>Programme pricing</small><strong data-programme-fee>To be announced</strong><span data-pricing-status>Pricing under final review</span>';
    }

    const registrationFee = [...document.querySelectorAll('.registration-meta > div')]
      .find(card => /programme fee|programme amount|pricing/i.test(card.querySelector('span')?.textContent || ''));
    if (registrationFee) {
      registrationFee.classList.add('fee-placeholder');
      registrationFee.innerHTML = '<span>Pricing</span><strong data-programme-fee>To be announced</strong><small data-pricing-status>Pricing under final review</small>';
    }

    const pricingFaq = [...document.querySelectorAll('.faq-list details')]
      .find(detail => /programme fee|programme amount/i.test(detail.querySelector('summary')?.textContent || ''));
    if (pricingFaq) {
      pricingFaq.innerHTML = '<summary>Where will programme pricing be published?<span>+</span></summary><p>The approved price, inclusions, exclusions, payment schedule and cancellation terms will be published in the pricing section on this page. Until then, no amount is being presented as final and no payment is collected with the application.</p>';
    }
  };

  const renderPricing = () => {
    const fee = formatProgrammeFee(pricingConfig);
    const isPublished = typeof pricingConfig.fee === 'number' && Number.isFinite(pricingConfig.fee) && pricingConfig.fee >= 0;
    const status = isPublished ? 'Current approved programme price' : (pricingConfig.status || 'Pricing under final review');
    const note = pricingConfig.note || 'No payment is collected with the application.';
    const updatedDate = new Date(pricingConfig.lastUpdated || Date.now());
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    }).format(updatedDate);

    document.querySelectorAll('[data-programme-fee]').forEach(element => { element.textContent = fee; });
    document.querySelectorAll('[data-pricing-status]').forEach(element => { element.textContent = status; });
    document.querySelectorAll('[data-pricing-note]').forEach(element => { element.textContent = note; });
    document.querySelectorAll('[data-pricing-updated]').forEach(element => {
      element.textContent = formattedDate;
      element.setAttribute('datetime', pricingConfig.lastUpdated || updatedDate.toISOString());
    });
    document.querySelector('#pricing')?.classList.toggle('pricing-published', isPublished);
  };

  document.addEventListener('nirogbhumi:pricing-update', event => {
    if (event.detail && typeof event.detail === 'object') Object.assign(pricingConfig, event.detail);
    renderPricing();
  });

  const dpdpDialogMarkup = () => `
    <dialog class="dpdp-dialog" id="dpdp-consent-dialog" aria-labelledby="dpdp-dialog-title">
      <div class="dpdp-dialog-shell">
        <header class="dpdp-dialog-header">
          <div>
            <p class="kicker">Privacy and consent</p>
            <h2 id="dpdp-dialog-title">DPDP Consent Notice and Privacy Policy</h2>
            <small>Effective 1 August 2026 · Version 1.0</small>
          </div>
          <button type="button" data-close-dpdp aria-label="Close privacy notice">×</button>
        </header>
        <div class="dpdp-dialog-body">
          <section>
            <h3>1. Data Fiduciary and contact</h3>
            <p>Nirog Bhumi is the Data Fiduciary responsible for the personal data collected through this application. Privacy and grievance requests may be sent to <a href="mailto:${PROGRAMME_CONTACT}?subject=DPDP%20Rights%20Request">${PROGRAMME_CONTACT}</a> or raised by calling <a href="tel:+917357542882">${PROGRAMME_PHONE}</a>. Postal location: Jaipur, Rajasthan, India.</p>
          </section>
          <section>
            <h3>2. Personal data covered by your consent</h3>
            <ul>
              <li>Identity and contact data, including your name, age, email address, phone number and location.</li>
              <li>Health-related data that you choose to provide, including diagnosis year, current treatment, HbA1c and conditions selected in the initial health screen.</li>
              <li>Readiness information, including availability, time commitment, motivation and emergency-contact details.</li>
              <li>Consent records, submission time, notice version and security or access logs when the production intake system is activated.</li>
            </ul>
          </section>
          <section>
            <h3>3. Specific purposes of processing</h3>
            <ul>
              <li>Assessing your application, eligibility and potential participation in the expedition.</li>
              <li>Contacting you about this expedition, its screening process and application decisions.</li>
              <li>Arranging medical screening or review if your application progresses.</li>
              <li>Planning and administering preparation, safety, travel and expedition operations.</li>
              <li>Maintaining necessary records, preventing misuse, handling grievances and complying with legal obligations.</li>
            </ul>
            <p>Your information will not be used for unrelated promotional communication unless you separately select the optional future-programmes consent.</p>
          </section>
          <section>
            <h3>4. Current prototype status</h3>
            <p>This prototype currently validates entries in your browser and does not transmit or store the completed application. Before formal applications open, it must be connected to an approved secure intake system. If the production collection, purpose, recipient categories or retention approach materially changes, an updated notice will be shown before consent is taken.</p>
          </section>
          <section>
            <h3>5. Access and permitted sharing</h3>
            <p>Access may be given only to authorised Nirog Bhumi personnel, designated medical consultants or reviewers, and approved service providers supporting secure intake and programme administration. Information may also be disclosed where required by law. Personal data will not be sold. Identifiable health information, stories, photographs or recordings will not be published without a separate and explicit consent appropriate to that use.</p>
          </section>
          <section>
            <h3>6. Retention, erasure and purpose limitation</h3>
            <p>Application data will be retained only for as long as reasonably necessary to assess and administer this expedition, resolve grievances and meet legal obligations. A documented retention schedule must be approved before the production form opens. Data that is no longer required will be securely erased or irreversibly anonymised. Contact data used for future initiatives will be retained only until that separate optional consent is withdrawn or the purpose ends.</p>
          </section>
          <section>
            <h3>7. Security safeguards and breach response</h3>
            <p>The production intake must use appropriate access controls, confidentiality restrictions, encryption in transit and at rest where applicable, logging, secure backups and incident-response procedures. Access must be limited to people who require the data for the stated purposes. Personal-data breaches will be handled and notified in accordance with applicable law.</p>
          </section>
          <section>
            <h3>8. Your rights and withdrawal of consent</h3>
            <p>Subject to applicable law, you may request information about your personal data and its processing, correction, completion or updating, erasure, grievance redressal, withdrawal of consent and nomination of another person to exercise rights in specified circumstances.</p>
            <p>You may withdraw consent as easily as you gave it by emailing <a href="mailto:${PROGRAMME_CONTACT}?subject=DPDP%20Consent%20Withdrawal">${PROGRAMME_CONTACT}</a> with the subject “DPDP Consent Withdrawal” or by calling <a href="tel:+917357542882">${PROGRAMME_PHONE}</a>. Withdrawal will not invalidate processing already carried out on the basis of valid consent, but it may prevent Nirog Bhumi from continuing to assess or administer your application.</p>
          </section>
          <section>
            <h3>9. Grievance redressal</h3>
            <p>Privacy and data-protection complaints may be sent through the contact channel above. Nirog Bhumi should acknowledge and address the grievance through its published process. Where applicable, you may approach the Data Protection Board of India after using the available grievance channel.</p>
          </section>
          <section>
            <h3>10. Adults only and consent evidence</h3>
            <p>This application is intended only for adults aged 18 or above. When the production system is activated, Nirog Bhumi should retain evidence of the notice version, consent choices and timestamps so consent can be demonstrated, reviewed and withdrawn.</p>
          </section>
        </div>
        <footer class="dpdp-dialog-footer">
          <p>Read this notice before selecting the required DPDP consent checkbox.</p>
          <button type="button" data-close-dpdp>Close notice</button>
        </footer>
      </div>
    </dialog>`;

  const consentMarkup = () => `
    <label class="consent-row"><input type="checkbox" name="accuracy" required><span>I confirm the information is accurate to the best of my knowledge. *</span></label>
    <label class="consent-row"><input type="checkbox" name="selection" required><span>I understand that applying does not guarantee selection. *</span></label>
    <label class="consent-row"><input type="checkbox" name="expeditionContact" required><span>I consent to this information being used to assess my participation and contacting me about this expedition. *</span></label>
    <label class="consent-row consent-row-dpdp"><input type="checkbox" name="dpdpConsent" required><span>I have read the <a href="#dpdp-consent-dialog" data-open-dpdp>DPDP Consent Notice and Privacy Policy</a> and consent to Nirog Bhumi processing my personal data, including the health information I provide, for the specific purposes stated in that notice. *</span></label>
    <label class="consent-row consent-row-optional"><input type="checkbox" name="futureContact"><span>Optional: I agree that Nirog Bhumi may contact me about future programmes and initiatives. I can withdraw this consent at any time.</span></label>`;

  const configureApplicationForm = () => {
    if (!document.body.classList.contains('application-page')) return;

    const quickFacts = document.querySelector('.application-quick-facts');
    if (quickFacts) {
      [...quickFacts.children].forEach(card => {
        const label = card.querySelector('span')?.textContent?.trim() || '';
        if (/programme fee|programme amount/i.test(label)) card.remove();
      });
    }

    const treatment = document.querySelector('select[name="treatment"]');
    if (treatment) {
      treatment.innerHTML = `
        <option value="">Select</option>
        <option>On medication</option>
        <option>On insulin</option>
        <option>Both medication and insulin</option>
        <option>None of the above</option>`;
    }

    const weeklyActivity = document.querySelector('select[name="activity"]')?.closest('label');
    weeklyActivity?.remove();

    const consents = document.querySelector('.consent-group');
    if (consents) {
      consents.setAttribute('aria-label', 'Application consents');
      consents.innerHTML = consentMarkup();
    }

    if (!document.querySelector('#dpdp-consent-dialog')) {
      document.body.insertAdjacentHTML('beforeend', dpdpDialogMarkup());
    }

    const form = document.querySelector('#registration-form');
    form?.addEventListener('invalid', event => {
      event.target.closest('.consent-row')?.classList.add('invalid');
    }, true);
    form?.addEventListener('change', event => {
      event.target.closest('.consent-row')?.classList.remove('invalid');
    });

    bindDpdpDialog();
  };

  const bindDpdpDialog = () => {
    const dialog = document.querySelector('#dpdp-consent-dialog');
    if (!dialog || dialog.dataset.bound === 'true') return;
    dialog.dataset.bound = 'true';
    let returnFocus = null;

    const open = trigger => {
      returnFocus = trigger || document.activeElement;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      dialog.querySelector('[data-close-dpdp]')?.focus();
    };

    const close = () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      returnFocus?.focus?.();
    };

    document.querySelectorAll('[data-open-dpdp]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        open(link);
      });
    });
    dialog.querySelectorAll('[data-close-dpdp]').forEach(button => button.addEventListener('click', close));
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  };

  const run = () => {
    harmoniseProgrammeName(document.body);
    updateLandingCopy();
    configureExistingPricingCards();
    ensurePricingSection();
    renderPricing();
    configureApplicationForm();
    harmoniseProgrammeName(document.body);
    document.documentElement.classList.add('feedback-overrides-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
