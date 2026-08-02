(() => {
  'use strict';

  const DAYARA_BUGYAL_URL = 'https://indiahikes.com/dayara-bugyal-trek';
  const WORLD_DIABETES_DAY = new Date('2026-11-14T00:00:00+05:30');

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

  const updatePurposeSection = () => {
    const purposeReading = document.querySelector('.purpose-reading');
    if (!purposeReading) return;

    purposeReading.innerHTML = `
      <details>
        <summary><span><small>Purpose 01</small>Why illness should not limit life’s possibilities</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>A diagnosis can become more than a medical condition. It can become a psychological boundary, making people believe that certain experiences, ambitions and adventures are no longer meant for them. We want to challenge that belief.</p>
          <p>Type 2 diabetes should possibly be able to pursue adventures, ambitions and challenging goals that are meaningful to them.</p>
          <blockquote>Take your health seriously, but do not allow your diagnosis to define the boundaries of your life.</blockquote>
        </div>
      </details>
      <details>
        <summary><span><small>Purpose 02</small>To Inspire Action Around the World</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>This expedition is not only about the people who participate in this Expedition. It is also about inspiring millions of people living with Type 2 diabetes to believe that change is possible and to begin taking meaningful action to realize that possibility.</p>
          <p>For someone with diabetes, climbing a mountain represents every difficult first step: changing a habit, improving sleep, becoming more active, eating differently, managing stress. By showing what people can achieve through preparation, discipline and support, we hope to encourage others across the world to begin their own journey toward better metabolic health and a life of greater possibility.</p>
          <p class="purpose-boundary">Each one’s “mountain” may look different. What matters is taking that first step towards conquering the mountain.</p>
        </div>
      </details>
      <details>
        <summary><span><small>Purpose 03</small>What we hope to learn about high altitude and glucose</span><i aria-hidden="true">+</i></summary>
        <div class="purpose-detail">
          <p>The expedition also offers an opportunity to observe how sustained physical activity at high altitude may affect glucose regulation in appropriately selected people living with Type 2 diabetes.</p>
          <p>Existing research is limited and not fully consistent. Some studies suggest that hypoxia may be associated with lower glucose levels or improved glucose utilisation. However, the available evidence is still limited and does not establish altitude as a treatment for diabetes. We will therefore study and document the experience responsibly, without claiming that climbing a mountain can reverse diabetes.</p>
          <p class="purpose-boundary">The initiative is hypothesis-generating, not a clinical trial or treatment claim.</p>
        </div>
      </details>`;

    bindPurposeAccordion(purposeReading);
  };

  const findGlanceCard = label => [...document.querySelectorAll('.glance-grid > *')]
    .find(card => card.querySelector('small')?.textContent.trim().toLowerCase() === label.toLowerCase());

  const updateGlanceSection = () => {
    document.querySelector('.glance-live')?.remove();

    const expeditionCard = findGlanceCard('Expedition');
    if (expeditionCard) {
      expeditionCard.innerHTML = '<small>Expedition</small><strong>6 days</strong>';
    }

    const altitudeCard = findGlanceCard('Altitude');
    if (altitudeCard) {
      altitudeCard.innerHTML = '<small>Altitude</small><strong>7–12K</strong><span>feet</span>';
    }

    const feeCard = [...document.querySelectorAll('.glance-grid > *')].find(card => {
      const label = card.querySelector('small')?.textContent || '';
      return /programme fee|programme pricing|programme amount/i.test(label) || card.classList.contains('glance-fee');
    });
    feeCard?.remove();

    const routeCard = findGlanceCard('Route');
    if (routeCard && !routeCard.matches('a')) {
      const link = document.createElement('a');
      link.className = `${routeCard.className || ''} glance-route-link`.trim();
      link.href = DAYARA_BUGYAL_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', 'View the Dayara Bugyal trek on Indiahikes');
      link.innerHTML = '<small>Route</small><strong>Dayara Bugyal</strong><span>View trek details on Indiahikes <b aria-hidden="true">↗</b></span>';
      routeCard.replaceWith(link);
    } else if (routeCard) {
      routeCard.classList.add('glance-route-link');
      routeCard.href = DAYARA_BUGYAL_URL;
      routeCard.target = '_blank';
      routeCard.rel = 'noopener';
      routeCard.innerHTML = '<small>Route</small><strong>Dayara Bugyal</strong><span>View trek details on Indiahikes <b aria-hidden="true">↗</b></span>';
    }
  };

  const countdownMarkup = () => `
    <div class="eligibility-countdown" aria-labelledby="eligibility-countdown-title" aria-live="polite">
      <div class="eligibility-countdown-copy">
        <p class="kicker">The journey begins now</p>
        <h3 id="eligibility-countdown-title">Countdown to<br><em>World Diabetes Day.</em></h3>
      </div>
      <div class="eligibility-countdown-grid" role="timer" aria-atomic="true">
        <div><strong data-full-countdown-days>—</strong><span>Days</span></div>
        <div><strong data-full-countdown-hours>—</strong><span>Hours</span></div>
        <div><strong data-full-countdown-minutes>—</strong><span>Minutes</span></div>
      </div>
    </div>`;

  const ensureEligibilityCountdown = () => {
    if (document.querySelector('.eligibility-countdown')) return;
    const eligibility = document.querySelector('#eligibility');
    if (!eligibility) return;

    const bottomSeam = eligibility.querySelector('.section-seam.seam-bottom');
    if (bottomSeam) bottomSeam.insertAdjacentHTML('beforebegin', countdownMarkup());
    else eligibility.insertAdjacentHTML('beforeend', countdownMarkup());
  };

  const updateFullCountdown = () => {
    const remaining = Math.max(0, WORLD_DIABETES_DAY.getTime() - Date.now());
    const totalMinutes = Math.floor(remaining / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const dayElement = document.querySelector('[data-full-countdown-days]');
    const hourElement = document.querySelector('[data-full-countdown-hours]');
    const minuteElement = document.querySelector('[data-full-countdown-minutes]');

    if (dayElement) dayElement.textContent = String(days);
    if (hourElement) hourElement.textContent = String(hours).padStart(2, '0');
    if (minuteElement) minuteElement.textContent = String(minutes).padStart(2, '0');
  };

  const run = () => {
    if (document.body.classList.contains('application-page')) return;
    updatePurposeSection();
    updateGlanceSection();
    ensureEligibilityCountdown();
    updateFullCountdown();
    window.setInterval(updateFullCountdown, 30000);
    document.documentElement.classList.add('feedback-content-v2-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
