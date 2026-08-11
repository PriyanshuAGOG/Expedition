// Temporary launch-timing change: pricing is hidden (not removed — see
// feedback-content-v24-register-interest.css) and every "Apply Now" button
// on the landing page redirects to WhatsApp with a pre-filled interest
// message instead of straight into apply.html. The application form itself
// is untouched and still fully live at apply.html — its direct link is
// being shared with people separately, not from the public buttons.
//
// To revert: delete this file and its stylesheet, and remove both from the
// `scripts`/`stylesheets` arrays in script.js. Nothing else needs undoing —
// every change here is additive (a class + new markup), not a rewrite of
// the files it touches.
(() => {
  'use strict';

  if (document.body?.classList.contains('application-page')) return;

  const WHATSAPP_NUMBER = '919588810249';
  const WHATSAPP_MESSAGE = "Hi! I'm interested in joining the World Diabetes Day Himalayan Expedition 2026. Could you share more details on how to register?";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  // Every button on the page whose visible text is "Apply Now"/"Apply now"
  // and links to apply.html — confirmed by tracing the boot pipeline that
  // these four are the only ones that survive to the final rendered page
  // (the v10 footer nav and v13 floating-nav "Apply" link both get replaced
  // /removed by later scripts before this one ever runs).
  const applyButtonSelectors = [
    '.footer-v11-apply',
    '.inline-apply',
    '.onboard-path[href="apply.html"]',
    '.primary-apply-button',
  ];

  const convertApplyButton = (link) => {
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Swap only the text node(s) that actually read "Apply Now"/"Apply now",
    // leaving icons, numbers and surrounding markup (e.g. the "01" span on
    // the participant card, the arrow glyph) exactly as they were.
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node = walker.nextNode();
    while (node) { nodes.push(node); node = walker.nextNode(); }
    nodes.forEach((textNode) => {
      if (/apply now/i.test(textNode.nodeValue)) {
        textNode.nodeValue = textNode.nodeValue.replace(/apply now/i, 'Register Interest');
      }
    });

    if (link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', link.getAttribute('aria-label').replace(/apply now/i, 'Register interest'));
    }
  };

  const convertApplyButtons = () => {
    applyButtonSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(convertApplyButton);
    });
  };

  // The "By applying you agree to the Participant Terms" note (added
  // earlier this session, right above .primary-apply-button) no longer
  // fits once that button goes to WhatsApp instead of the form — hide it
  // alongside the pricing details rather than deleting it, so it comes
  // back automatically once this whole module is removed.
  const hideApplyContext = () => {
    document.querySelectorAll('.registration-terms-note').forEach((note) => {
      note.classList.add('register-mode-hidden');
    });
  };

  // The "Ready to apply?" card's own heading/description/time estimate
  // still describe filling out the form directly — once its button opens
  // WhatsApp instead, "The application takes about five minutes" is simply
  // wrong, not just off-brand. Rewrite the text in place (not a DOM swap,
  // so nothing here needs to be found again if this module is removed) and
  // hide the now-inapplicable "Time: 5 mins" meta tile.
  const rewriteRegistrationCard = () => {
    const card = document.querySelector('.registration-cta-card');
    if (!card) return;

    const heading = card.querySelector('#register-title, h2');
    if (heading) heading.innerHTML = 'Register your<br><em>interest.</em>';

    const description = card.querySelector(':scope > p:not(.kicker)');
    if (description) {
      description.textContent = "Message us on WhatsApp to register your interest — we'll share full programme details and next steps directly.";
    }

    [...card.querySelectorAll('.registration-meta > div')].forEach((item) => {
      const label = item.querySelector('span')?.textContent || '';
      if (/^time$/i.test(label)) item.classList.add('register-mode-hidden');
    });
  };

  const registerPanelMarkup = () => `
    <div class="fee-v24-register-panel">
      <p class="kicker">Registrations open</p>
      <h2>Register your <em>interest.</em></h2>
      <p>Register your interest, and our team will personally walk you through the next steps.</p>
      <a class="primary-apply-button fee-v24-register-button" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">Register Interest</a>
    </div>`;

  const hidePricingDetails = () => {
    const pricing = document.querySelector('#pricing');
    const inner = pricing?.querySelector('.fee-v11-inner');
    if (!pricing || !inner) return;
    if (inner.querySelector('.fee-v24-register-panel')) return; // already run

    pricing.classList.add('register-mode-v24');
    inner.insertAdjacentHTML('beforeend', registerPanelMarkup());
  };

  // The #register section ("Ready to apply?" → rewritten above to "Register
  // your interest") now sits directly under #pricing's own "Register your
  // interest" panel, saying the same thing twice back to back. Hide it the
  // same reversible way as pricing — rewriteRegistrationCard() above still
  // runs first, so the text is ready to reappear correctly once this
  // section is unhidden alongside the pricing/transaction details.
  const hideRedundantRegisterSection = () => {
    document.querySelector('#register')?.classList.add('register-mode-hidden');
  };

  const run = () => {
    hidePricingDetails();
    convertApplyButtons();
    hideApplyContext();
    rewriteRegistrationCard();
    hideRedundantRegisterSection();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
