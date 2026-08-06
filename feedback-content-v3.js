(() => {
  'use strict';

  const CONTACT_EMAIL = 'priyanshu@nirogbhumi.com';
  const CONTACT_PHONE = '+919588810249';
  const CONTACT_PHONE_DIGITS = '919588810249';

  const replaceGlobalDetails = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.matches('script, style, textarea')) return NodeFilter.FILTER_REJECT;
        const text = node.nodeValue || '';
        return /8[–-]10\s*(minutes|min)|November\s+12\s*[–-]\s*19|12\s*[–-]\s*19\s+Nov|nirogbhumi@gmail\.com|\+91\s*73575\s*42882/i.test(text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/8[–-]10\s*minutes/gi, '5 minutes')
        .replace(/8[–-]10\s*min/gi, '5 min')
        .replace(/November\s+12\s*[–-]\s*19,?\s*2026/gi, 'November 13–18, 2026')
        .replace(/November\s+12\s*[–-]\s*19/gi, 'November 13–18')
        .replace(/12\s*[–-]\s*19\s+Nov(?:ember)?/gi, '13–18 Nov')
        .replace(/nirogbhumi@gmail\.com/gi, CONTACT_EMAIL)
        .replace(/\+91\s*73575\s*42882/g, CONTACT_PHONE);
    });

    document.querySelectorAll('[href]').forEach(link => {
      const current = link.getAttribute('href') || '';
      const updated = current
        .replace(/nirogbhumi@gmail\.com/gi, CONTACT_EMAIL)
        .replace(/917357542882/g, CONTACT_PHONE_DIGITS)
        .replace(/\+917357542882/g, CONTACT_PHONE);
      if (updated !== current) link.setAttribute('href', updated);
    });
  };

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

  const updatePurposeSection = () => {
    const intro = document.querySelector('.purpose-heading > p:last-child');
    if (intro) {
      intro.innerHTML = 'We are bringing people living with type 2 diabetes together to take action and inspire people to improve metabolic health<br>and eventually reach diabetes remission.';
    }

    const purposeReading = document.querySelector('.purpose-reading');
    if (!purposeReading) return;

    purposeReading.innerHTML = `
      <details>
        <summary><span><small>Purpose 01</small>Why illness should not limit life’s possibilities</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>A diagnosis can become more than a medical condition. It can become a psychological boundary, making people believe that certain experiences, ambitions and adventures are no longer meant for them. We want to challenge that belief.</p>
          <blockquote>Take your health seriously, but do not allow your diagnosis to define the boundaries of your life.</blockquote>
        </div>
      </details>
      <details>
        <summary><span><small>Purpose 02</small>To inspire action around the world</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>This expedition is not only about the people who participate in this expedition. It is also about inspiring millions of people living with type 2 diabetes to take meaningful action to achieve diabetes remission.</p>
          <p>For someone with diabetes, climbing a mountain represents every difficult first step: changing a habit, improving sleep, becoming more active, eating differently and managing stress. By showing what people can achieve through preparation, discipline and support, we hope to encourage others across the world to begin their own journey toward better metabolic health and a life of greater possibility.</p>
          <p class="purpose-boundary">Each one’s “mountain” may look different. What matters is taking that first step towards conquering the mountain.</p>
        </div>
      </details>
      <details>
        <summary><span><small>Purpose 03</small>What we hope to learn about high altitude, glucose and remission</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>The expedition also offers an opportunity to observe how sustained physical activity at high altitude may affect glucose regulation in people living with type 2 diabetes.</p>
          <p>Some studies suggest that hypoxia at high altitude may be associated with lower glucose levels or improved glucose regulation. However, the available evidence is still limited and does not establish high altitude as a treatment for diabetes. We will therefore study and document the experience responsibly.</p>
          <p class="purpose-boundary">The initiative is hypothesis-generating, not a clinical trial or treatment claim.</p>
        </div>
      </details>`;

    bindSingleOpen(purposeReading);
  };

  const setStep = (step, { heading, body, footer, removeFooter = false }) => {
    if (!step) return;
    const copy = step.querySelector('.xp-step-copy');
    if (!copy) return;
    if (heading !== undefined) copy.querySelector('h3').textContent = heading;
    if (body !== undefined) copy.querySelector(':scope > p:not(.xp-step-tag)').textContent = body;
    const small = copy.querySelector('small');
    if (removeFooter) small?.remove();
    else if (footer !== undefined && small) small.textContent = footer;
  };

  const updateParticipantJourney = () => {
    const lead = document.querySelector('#trail .xp-lead');
    if (lead) lead.textContent = 'From the first application to continuing the practices at home, each stage has a clear purpose.';
    document.querySelector('#trail .xp-legend')?.remove();

    const steps = [...document.querySelectorAll('#trail .xp-step')];
    setStep(steps[0], { footer: 'Initial application · 5 minutes' });
    setStep(steps[1], { footer: 'About one hour each morning' });
    setStep(steps[2], {
      heading: 'Receive approval to trek.',
      footer: 'Submit medical reports'
    });
    setStep(steps[3], {
      heading: 'Hit the trail.',
      body: 'Complete the six-day route with the group.'
    });
    setStep(steps[4], {
      heading: 'Recover. Continue.',
      body: 'Bring the learning home and continue the practices beyond the expedition.',
      footer: 'Long-term continuity'
    });
  };

  const updatePreparation = () => {
    const pillars = [...document.querySelectorAll('.prep-pillars article')];
    if (pillars[0]) pillars[0].querySelector('p').textContent = 'Baseline assessment and final medical clearance.';
    if (pillars[2]) pillars[2].querySelector('h3').textContent = 'Fitness & Yoga';
    if (pillars[3]) pillars[3].querySelector('p').textContent = 'Stress management, breathwork, meditation and mental preparation.';
  };

  const updateExpeditionSection = () => {
    document.querySelector('#expedition .route-reveal')?.remove();
    document.querySelector('#expedition .valley-quote')?.remove();
  };

  const updateSafety = () => {
    const items = [...document.querySelectorAll('.safety-sequence > li')];
    if (items[0]) {
      items[0].querySelector('h3').textContent = 'Screening before selection';
      items[0].querySelector('p').textContent = 'Based on health history.';
    }
    if (items[2]) {
      items[2].querySelector('h3').textContent = 'Clearance before trek';
      items[2].querySelector('p').textContent = 'Fitness certificate from a physician.';
    }
    if (items[3]) items[3].querySelector('h3').textContent = 'Regular monitoring during the trek';
  };

  const updateEligibility = () => {
    const title = document.querySelector('#eligibility-title');
    if (title) title.innerHTML = 'Check Your <em>Eligibility.</em>';

    const panels = document.querySelector('#eligibility .check-panels');
    const eligibilityCard = panels?.querySelector('.check-panel:not(.requirements)');
    panels?.querySelector('.check-panel.requirements')?.remove();
    panels?.classList.add('eligibility-only');

    const list = eligibilityCard?.querySelector('ul');
    if (list) {
      list.innerHTML = `
        <li>Adults living with Type 2 diabetes or prediabetes (based on a 2026 report)</li>
        <li>Should not have any diabetes-related complications</li>
        <li>Able to commit about an hour each morning from September to mid-November.</li>
        <li>Available from November 13–18, 2026 for the expedition</li>`;
    }
  };

  const updateCountdown = () => {
    const title = document.querySelector('#eligibility-countdown-title');
    if (title) title.innerHTML = 'Countdown to<br><em>The World Diabetes Day</em><small>(as per IST)</small>';
  };

  const updateParticipants = () => {
    const quotes = [...document.querySelectorAll('.participant-quotes blockquote')];
    const familyQuote = quotes.find(quote => /my family/i.test(quote.textContent));
    if (familyQuote) familyQuote.textContent = '“I want my family to see what consistent effort can result.”';

    const afterSelection = document.querySelector('.participant-future > summary');
    if (afterSelection) afterSelection.innerHTML = 'After selection: meet the participants <span>+</span>';
  };

  const nominationMarkup = () => `
    <form class="onboard-path nomination-form reveal" aria-label="Nominate someone for the expedition">
      <span>02</span>
      <h3>Nominate someone</h3>
      <p>Recommend a person living with type 2 diabetes.</p>
      <label><b>Name *</b><input name="nomineeName" autocomplete="name" required></label>
      <label><b>Email <small>(optional)</small></b><input type="email" name="nomineeEmail" autocomplete="email"></label>
      <label><b>Phone *</b><input type="tel" name="nomineePhone" autocomplete="tel" required></label>
      <button type="submit">Submit nomination <i>↗</i></button>
      <small class="nomination-note">Your email app will open with the nomination details. This page does not store the form.</small>
      <output class="nomination-status" aria-live="polite"></output>
    </form>`;

  const bindNominationForm = form => {
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('nomineeName') || '').trim();
      const email = String(data.get('nomineeEmail') || '').trim();
      const phone = String(data.get('nomineePhone') || '').trim();
      const subject = encodeURIComponent('Nomination for World Diabetes Day Himalayan Expedition 2026');
      const body = encodeURIComponent(`Nominee name: ${name}\nNominee email: ${email || 'Not provided'}\nNominee phone: ${phone}\n\nI would like to nominate this person for the expedition.`);
      const status = form.querySelector('.nomination-status');
      if (status) status.textContent = 'Opening your email app…';
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  };

  const updateOnboarding = () => {
    const section = document.querySelector('#partners');
    const heading = section?.querySelector('.onboard-heading');
    if (heading) {
      const kicker = heading.querySelector('.kicker');
      const description = heading.querySelector('p:last-child');
      if (kicker) kicker.textContent = 'Ways to take part';
      if (description) description.textContent = 'Participate, nominate someone, partner with us, or follow the journey.';
    }

    const paths = section?.querySelector('.onboard-paths');
    if (!paths) return;

    const nominationCard = [...paths.querySelectorAll('.onboard-path')]
      .find(card => /nominate someone/i.test(card.querySelector('h3')?.textContent || ''));
    if (nominationCard) nominationCard.outerHTML = nominationMarkup();

    const participantCard = [...paths.querySelectorAll('.onboard-path')]
      .find(card => /join as a participant/i.test(card.querySelector('h3')?.textContent || ''));
    participantCard?.querySelector(':scope > span')?.replaceChildren('01');

    const followCard = [...paths.querySelectorAll('.onboard-path')]
      .find(card => /follow the expedition/i.test(card.querySelector('h3')?.textContent || ''));
    if (followCard) {
      followCard.querySelector(':scope > span')?.replaceChildren('03');
      const description = followCard.querySelector('p');
      if (description) description.textContent = 'See how participants are taking diabetes head-on.';
      followCard.href = 'https://chat.whatsapp.com/D8vwzdVgaLp2FRYySflJYL?s=cl&p=a&ilr=1';
      followCard.target = '_blank';
      followCard.rel = 'noopener noreferrer';
      followCard.setAttribute('aria-label', 'Join the expedition WhatsApp group');
    }

    paths.classList.add('onboard-paths-three');
    bindNominationForm(paths.querySelector('.nomination-form'));

    const floatingPartners = document.querySelector('.floating-nav a[aria-label="Partners"]');
    if (floatingPartners) {
      floatingPartners.setAttribute('aria-label', 'Join');
      const label = floatingPartners.querySelector('span');
      if (label) label.textContent = 'Join';
    }

    const journalUpdate = document.querySelector('.journal-update p');
    if (journalUpdate) journalUpdate.textContent = journalUpdate.textContent.replace(/selection,\s*partner\s*and\s*trail/i, 'selection and trail');
  };

  const updateRegistration = () => {
    const card = document.querySelector('.registration-cta-card');
    if (!card) return;
    const kicker = card.querySelector('.kicker');
    const description = card.querySelector(':scope > p:not(.kicker)');
    if (kicker) kicker.textContent = 'World Diabetes Day Himalayan Expedition 2026';
    if (description) description.textContent = 'The application takes about five minutes. Applying does not guarantee selection.';

    const meta = card.querySelector('.registration-meta');
    meta?.querySelectorAll(':scope > div').forEach(item => {
      const label = item.querySelector('span')?.textContent || '';
      if (/programme fee|pricing|programme amount/i.test(label)) item.remove();
      if (/^time$/i.test(label)) item.querySelector('strong').textContent = '5 min';
      if (/^dates$/i.test(label)) item.querySelector('strong').textContent = '13–18 Nov';
    });
    meta?.classList.add('registration-meta-no-price');
  };

  const updateFaqs = () => {
    const heading = document.querySelector('.faq-heading');
    if (heading) {
      const kicker = heading.querySelector('.kicker');
      const title = heading.querySelector('h2');
      if (kicker) kicker.textContent = 'FAQs';
      if (title) title.innerHTML = 'Questions to help you<br><em>take the next step.</em>';
    }

    const list = document.querySelector('.faq-list');
    if (!list) return;
    list.innerHTML = `
      <details class="reveal visible"><summary>Do I need previous trekking experience?<span>+</span></summary><p>No. Previous trekking experience is not required. The 60-day preparation is designed to help you build readiness step by step. Final participation depends on medical and fitness clearance.</p></details>
      <details class="reveal visible"><summary>What happens during the 60 days of preparation?<span>+</span></summary><p>Participants follow an approximately one-hour morning routine of yogic practices, meditation, and physical fitness.</p></details>`;
    bindSingleOpen(list);
  };

  const updateApplicationPage = () => {
    const commitment = document.querySelector('select[name="timeCommitment"]')?.closest('label')?.querySelector(':scope > span');
    if (commitment) commitment.textContent = 'Can you commit about one hour each morning? *';

    const availability = document.querySelector('select[name="availability"]')?.closest('label')?.querySelector(':scope > span');
    if (availability) availability.textContent = 'Available from November 13–18, 2026? *';
  };

  const updateFooter = () => {
    const footerEmail = document.querySelector('.footer-contact a[href^="mailto:"]');
    const footerPhone = document.querySelector('.footer-contact a[href^="tel:"]');
    if (footerEmail) {
      footerEmail.href = `mailto:${CONTACT_EMAIL}`;
      footerEmail.textContent = CONTACT_EMAIL;
    }
    if (footerPhone) {
      footerPhone.href = `tel:${CONTACT_PHONE}`;
      footerPhone.textContent = CONTACT_PHONE;
    }
  };

  const run = () => {
    replaceGlobalDetails();
    updateApplicationPage();

    if (document.body.classList.contains('application-page')) {
      replaceGlobalDetails();
      document.documentElement.classList.add('feedback-content-v3-ready');
      return;
    }

    updatePurposeSection();
    updateParticipantJourney();
    updatePreparation();
    updateExpeditionSection();
    updateSafety();
    updateEligibility();
    updateCountdown();
    updateParticipants();
    updateOnboarding();
    updateRegistration();
    updateFaqs();
    updateFooter();
    replaceGlobalDetails();
    document.documentElement.classList.add('feedback-content-v3-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
