(() => {
  'use strict';

  const CONTACT_EMAIL = 'priyanshu@nirogbhumi.com';
  const CONTACT_PHONE_DISPLAY = '+91 95888 10249';
  const CONTACT_PHONE_LINK = '+919588810249';
  const WEBSITE = 'https://nirogbhumi.com';

  const removeObsoleteHeroActions = () => {
    document.querySelectorAll('.hero-ctas a').forEach(link => {
      if (/partner/i.test(link.textContent || '')) link.remove();
    });
  };

  const polishOnboarding = () => {
    const section = document.querySelector('#partners');
    if (!section) return;

    const intro = section.querySelector('.onboard-heading > p:last-child');
    if (intro) intro.textContent = 'Apply, nominate someone, or follow the expedition.';

    const paths = section.querySelector('.onboard-paths');
    if (!paths) return;
    paths.classList.add('onboard-paths-v10');

    [...paths.children].forEach((card, index) => {
      card.classList.add('onboard-path-v10');
      const number = card.querySelector(':scope > span');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });

    const navPartners = document.querySelector('.floating-nav a[href="#partners"]');
    if (navPartners) {
      navPartners.setAttribute('aria-label', 'Ways to join');
      const label = navPartners.querySelector('span');
      if (label) label.textContent = 'Join';
    }
  };

  const footerMarkup = () => `
    <img class="footer-v10-bg" src="assets/experience/webp/15-evening-camp.webp" alt="A quiet Himalayan forest camp at blue hour" loading="lazy" decoding="async">
    <div class="footer-v10-grade" aria-hidden="true"></div>
    <img class="footer-v10-seam" src="assets/experience/webp/22-canopy-seam.webp" alt="" loading="lazy" decoding="async">
    <img class="footer-v10-flora footer-v10-flora-left" src="assets/botanicals/webp/41-fern-corner-left.webp" alt="" loading="lazy" decoding="async">
    <img class="footer-v10-flora footer-v10-flora-right" src="assets/botanicals/webp/42-fern-corner-right.webp" alt="" loading="lazy" decoding="async">

    <div class="footer-v10-inner">
      <section class="footer-v10-identity" aria-labelledby="footer-v10-title">
        <img class="footer-v10-logo" src="assets/branding/webp/nirogbhumi-wordmark.webp" alt="NirogBhumi" width="900" height="206" loading="lazy" decoding="async">
        <p class="kicker">World Diabetes Day Himalayan Expedition 2026</p>
        <h2 id="footer-v10-title">Health can be taken seriously<br><em>without making life smaller.</em></h2>
        <p>Follow the preparation, meet the participants and stay connected as the expedition moves from intention to action.</p>
        <a class="footer-v10-site" href="${WEBSITE}" target="_blank" rel="noopener">Visit nirogbhumi.com <span>↗</span></a>
      </section>

      <section class="footer-v10-connect" aria-label="Contact NirogBhumi">
        <p class="kicker">Connect with us</p>
        <div class="footer-v10-contact-grid">
          <a href="mailto:${CONTACT_EMAIL}"><small>Email</small><strong>${CONTACT_EMAIL}</strong><span>Write to the expedition team ↗</span></a>
          <a href="tel:${CONTACT_PHONE_LINK}"><small>Phone</small><strong>${CONTACT_PHONE_DISPLAY}</strong><span>Call the expedition team ↗</span></a>
          <a href="https://wa.me/${CONTACT_PHONE_LINK.replace('+', '')}" target="_blank" rel="noopener"><small>WhatsApp</small><strong>Start a conversation</strong><span>Message NirogBhumi ↗</span></a>
          <div><small>Based in</small><strong>Jaipur, Rajasthan</strong><span>India · Global expedition</span></div>
        </div>
      </section>

      <nav class="footer-v10-nav" aria-label="Footer navigation">
        <a href="#briefing">Purpose</a>
        <a href="#trail">Participant journey</a>
        <a href="#preparation">Preparation</a>
        <a href="#safety">Safety</a>
        <a href="#eligibility">Eligibility</a>
        <a href="#faq">FAQs</a>
        <a href="apply.html" target="_top">Apply now ↗</a>
      </nav>

      <aside class="footer-v10-disclaimer">
        <span aria-hidden="true">i</span>
        <p><strong>Wellness education and expedition information only.</strong> NirogBhumi does not replace medical advice, diagnosis, emergency care or treatment. Speak with your treating physician before changing medication, diet or physical activity.</p>
      </aside>

      <div class="footer-v10-bottom">
        <span>© 2026 NirogBhumi</span>
        <span>World Diabetes Day Himalayan Expedition 2026</span>
        <a href="${WEBSITE}" target="_blank" rel="noopener">nirogbhumi.com</a>
      </div>
    </div>`;

  const rebuildFooter = () => {
    const footer = document.querySelector('.site-footer');
    if (!footer || footer.classList.contains('footer-v10')) return;
    footer.className = 'site-footer footer-v10';
    footer.innerHTML = footerMarkup();
  };

  const addResponsiveHooks = () => {
    document.documentElement.classList.add('final-responsive-qa-v10');
    document.querySelector('#pricing')?.classList.add('pricing-v10');
    document.querySelector('#expedition-gains')?.classList.add('gains-v10');
    document.querySelector('.floating-nav')?.classList.add('floating-nav-v10');
  };

  const run = () => {
    if (document.body.classList.contains('application-page')) return;
    removeObsoleteHeroActions();
    polishOnboarding();
    rebuildFooter();
    addResponsiveHooks();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
