(() => {
  'use strict';

  const DAYARA_URL = 'https://indiahikes.com/dayara-bugyal-trek';

  const addPricingNote = () => {
    const pricing = document.querySelector('#pricing');
    if (!pricing || pricing.querySelector('.fee-v12-participant-note')) return;

    const note = document.createElement('aside');
    note.className = 'fee-v12-participant-note fee-v18-cost-card v11-visible';
    note.setAttribute('aria-label', 'Additional participant costs');
    note.innerHTML = `
      <span class="fee-v18-cost-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
      <div>
        <small>Additional participant costs</small>
        <ul>
          <li>We may request participants to purchase some small-value tools. These purchases will be optional and paid for by the participant.</li>
          <li>Periodic testing will need to be arranged and paid for by the participant.</li>
        </ul>
      </div>`;

    const localCosts = pricing.querySelector('.fee-v18-cost-card');
    if (localCosts) localCosts.insertAdjacentElement('afterend', note);
    else pricing.querySelector('.fee-v11-inner')?.appendChild(note);
  };

  const faqMarkup = () => `
    <details class="reveal visible">
      <summary>What happens during the 60 days of preparation?<span>+</span></summary>
      <p>Participants follow an approximately one-hour morning routine of yogic practices, meditation and physical fitness. The programme also builds consistency, walking capacity, strength, mobility and readiness for the trek.</p>
    </details>
    <details class="reveal visible">
      <summary>Do I need previous trekking experience?<span>+</span></summary>
      <p>No previous Himalayan trekking experience is required. Dayara Bugyal is classified as an easy-moderate trek suitable for fit beginners, but every participant must complete the preparation programme and receive final medical clearance.</p>
    </details>
    <details class="reveal visible">
      <summary>What is the Dayara Bugyal route like?<span>+</span></summary>
      <p>The reference route covers about 21 km across four trekking days, within a six-day journey including travel to and from basecamp. It rises from roughly 7,100 ft to 11,830 ft. Much of the trail is gradual, although the initial forest climb and the final climb towards Dayara Top can be steep. The final expedition itinerary will be confirmed separately.</p>
    </details>
    <details class="reveal visible">
      <summary>What fitness level should I work towards?<span>+</span></summary>
      <p>The 60-day preparation programme is designed to build progressive readiness. As a route-specific benchmark, Indiahikes recommends being able to walk, jog or run 5 km within 40 minutes. NirogBhumi will assess expedition readiness through its own preparation, medical-review and final-clearance process.</p>
    </details>
    <details class="reveal visible">
      <summary>What weather should I expect in April?<span>+</span></summary>
      <p>April conditions can change quickly with altitude. Lower sections can be mild and spring-like, while higher camps may still see overnight freezing temperatures and possible residual snow or icy patches. Participants should be prepared for cold mornings, changing weather and route decisions made for safety.</p>
    </details>
    <details class="reveal visible">
      <summary>Can altitude sickness happen on this trek?<span>+</span></summary>
      <p>Yes. The route goes above 10,000 ft, where Acute Mountain Sickness can affect first-time and experienced trekkers alike. Fitness can make trekking easier, but it does not remove altitude risk. Participants must report symptoms promptly and follow the expedition team's medical and safety instructions.</p>
    </details>
    <p class="faq-v12-source">Route-specific distance, altitude, difficulty, fitness and seasonal guidance are adapted from the official Indiahikes Dayara Bugyal trek reference. <a href="${DAYARA_URL}" target="_blank" rel="noopener">View the route reference ↗</a></p>`;

  const rebuildFaqs = () => {
    if (document.body.classList.contains('application-page')) return;
    const list = document.querySelector('#faq .faq-list');
    if (!list) return;
    list.classList.add('faq-list-v12');
    list.innerHTML = faqMarkup();

    const headingKicker = document.querySelector('#faq .faq-heading .kicker');
    if (headingKicker) headingKicker.textContent = 'FAQs';
  };

  const run = () => {
    if (!document.body.classList.contains('application-page')) {
      addPricingNote();
      rebuildFaqs();
    }
    document.documentElement.classList.add('feedback-content-v12-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();