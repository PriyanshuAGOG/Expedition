(() => {
  'use strict';

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
    centreCommunityPillar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
