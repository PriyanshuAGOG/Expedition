(() => {
  'use strict';

  const replaceApplicationTime = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.matches('script, style, textarea')) return NodeFilter.FILTER_REJECT;
        return /8[–-]10\s*(minutes|min)/i.test(node.nodeValue || '')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/8[–-]10\s*minutes/gi, '5 minutes')
        .replace(/8[–-]10\s*min/gi, '5 min');
    });
  };

  const bindPurposeAccordion = container => {
    container.querySelectorAll('details').forEach(detail => {
      detail.open = false;
      detail.addEventListener('toggle', () => {
        if (!detail.open) return;
        container.querySelectorAll('details[open]').forEach(other => {
          if (other !== detail) other.open = false;
        });
      });
    });
  };

  const updateHeroSummary = () => {
    const summary = document.querySelector('.hero-campaign > p');
    if (!summary) return;
    summary.classList.add('hero-campaign-summary');
    summary.innerHTML = '<strong>60 days of preparation · 6 day Himalayan expedition</strong><strong class="hero-campaign-date">World Diabetes Day 2026</strong>';
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
          <p>Existing research is limited and not fully consistent. Some studies suggest that hypoxia at high altitude may be associated with lower glucose levels or improved glucose regulation. However, the available evidence is still limited and does not establish high altitude as a treatment for diabetes. We will therefore study and document the experience responsibly, without claiming that climbing a mountain can reverse diabetes.</p>
          <p class="purpose-boundary">The initiative is hypothesis-generating, not a clinical trial or treatment claim.</p>
        </div>
      </details>`;

    bindPurposeAccordion(purposeReading);
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
    setStep(steps[1], {
      heading: 'Assessment of individual profile.',
      body: 'Physician review of health profile.',
      removeFooter: true
    });
    setStep(steps[2], { footer: 'About one hour each morning' });
    setStep(steps[3], {
      heading: 'Receive approval to trek.',
      footer: 'Submit medical reports'
    });
    setStep(steps[4], {
      heading: 'Hit the trail.',
      body: 'Complete the six-day route with the group.'
    });
    setStep(steps[5], {
      heading: 'Recover. Continue.',
      body: 'Bring the learning home and continue the practices beyond the expedition.',
      footer: 'Long-term continuity'
    });
  };

  const updatePreparation = () => {
    const pillars = [...document.querySelectorAll('.prep-pillars article')];
    if (pillars[0]) pillars[0].querySelector('p').textContent = 'Baseline assessment and final medical clearance.';
    if (pillars[2]) pillars[2].querySelector('h3').textContent = 'Fitness and Yog';
    if (pillars[3]) pillars[3].querySelector('p').textContent = 'Stress management, breathwork, meditation and mental preparation.';
  };

  const updateExpeditionSection = () => {
    document.querySelector('#expedition .route-reveal')?.remove();
    document.querySelector('#expedition .valley-quote')?.remove();
  };

  const updateSafety = () => {
    const items = [...document.querySelectorAll('.safety-sequence > li')];
    if (items[0]) items[0].querySelector('p').textContent = 'Health history and physician approval.';
    if (items[2]) {
      items[2].querySelector('h3').textContent = 'Clearance before trek.';
      items[2].querySelector('p').textContent = 'Fitness certificate from the treating physician and medical approval from the NirogBhumi designated medical consultant.';
    }
    if (items[3]) items[3].querySelector('h3').textContent = 'Regular monitoring during the trek.';
  };

  const updateEligibility = () => {
    const title = document.querySelector('#eligibility-title');
    if (title) title.innerHTML = '<em>Eligibility.</em>';

    const panels = document.querySelector('#eligibility .check-panels');
    const eligibilityCard = panels?.querySelector('.check-panel:not(.requirements)');
    const requirementsCard = panels?.querySelector('.check-panel.requirements');
    requirementsCard?.remove();
    panels?.classList.add('eligibility-only');

    const list = eligibilityCard?.querySelector('ul');
    if (list) {
      list.innerHTML = `
        <li>Adults living with type 2 diabetes</li>
        <li>Should not have any diabetes-related complications</li>
        <li>Able to commit about an hour each morning during September and October</li>
        <li>Available from November 12–19, 2026 for the expedition</li>`;
    }
  };

  const updateCountdown = () => {
    const title = document.querySelector('#eligibility-countdown-title');
    if (title) title.innerHTML = 'Countdown to<br><em>The World Diabetes Day</em><small>(as per IST)</small>';
  };

  const updateDashboard = () => {
    const dashboardTitle = document.querySelector('#dashboard-title');
    if (dashboardTitle) dashboardTitle.textContent = 'Aggregated information, not private health data.';
  };

  const run = () => {
    replaceApplicationTime();
    if (document.body.classList.contains('application-page')) {
      document.documentElement.classList.add('feedback-content-v3-ready');
      return;
    }

    updateHeroSummary();
    updatePurposeSection();
    updateParticipantJourney();
    updatePreparation();
    updateExpeditionSection();
    updateSafety();
    updateEligibility();
    updateCountdown();
    updateDashboard();
    document.documentElement.classList.add('feedback-content-v3-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
