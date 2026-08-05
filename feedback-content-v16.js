(() => {
  'use strict';

  const rebuildHeroActions = () => {
    const campaign = document.querySelector('.hero-campaign');
    const summary = campaign?.querySelector(':scope > p');
    const ctas = campaign?.querySelector('.hero-ctas');
    if (!campaign || !summary || !ctas) return;

    campaign.classList.add('hero-campaign-v16');

    summary.className = 'hero-summary-v16';
    summary.setAttribute(
      'aria-label',
      '45 days of preparation, World Diabetes Day 2026, six-day Himalayan expedition'
    );
    summary.innerHTML = `
      <span><b>45 days</b><small>Preparation</small></span>
      <span><b>World Diabetes Day</b><small>2026</small></span>
      <span><b>6-day</b><small>Himalayan expedition</small></span>`;

    [...ctas.querySelectorAll('.hero-cta')].forEach(link => {
      const label = link.textContent.trim();
      if (!/^apply now$/i.test(label)) link.remove();
    });
    ctas.classList.add('hero-ctas-v16', 'hero-ctas-v18-single');
  };

  const centreCommunityPillar = () => {
    const community = document.querySelector('.prep-community-v15');
    if (!community) return;

    community.classList.add('prep-community-v16');
    community.innerHTML = `
      <div>
        <b>05</b>
        <h3>Community</h3>
        <p>Group accountability, shared learning, regular check-ins and support throughout the journey.</p>
      </div>`;
  };

  const run = () => {
    document.documentElement.classList.add('final-symmetry-v16');
    rebuildHeroActions();
    centreCommunityPillar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
