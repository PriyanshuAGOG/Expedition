// "Become a partner" dialog: injects the modal, binds its open/close
// triggers, and submits to the partnerships table. Mirrors the structure
// and CSS classes of the nomination dialog (feedback-content-v8.js) for a
// consistent look, with its own id/data-attributes so the two don't collide.

const CONTACT_EMAIL = 'nirogbhumi@gmail.com';

const dialogMarkup = () => `
  <dialog class="nomination-dialog" id="partner-dialog" aria-labelledby="partner-dialog-title">
    <div class="nomination-dialog-shell">
      <button class="nomination-dialog-close" type="button" data-close-partner aria-label="Close partner form">×</button>
      <div class="nomination-dialog-visual" aria-hidden="true">
        <img src="assets/sections/webp/11-expedition-team.webp" alt="" loading="lazy" decoding="async">
        <div></div>
        <span>Partner with<br>the expedition.</span>
      </div>
      <form class="nomination-dialog-form" id="partner-dialog-form">
        <p class="kicker">Become a partner</p>
        <h2 id="partner-dialog-title">Bring your support<br><em>to the journey.</em></h2>
        <p>Medical knowledge, equipment, travel, logistics or responsible storytelling — tell us how you'd like to help.</p>
        <label><span>Your name *</span><input name="contactName" autocomplete="name" required></label>
        <label><span>Organisation <small>(optional)</small></span><input name="organisation" autocomplete="organization"></label>
        <label><span>Email *</span><input type="email" name="email" autocomplete="email" required></label>
        <label><span>Phone <small>(optional)</small></span><input type="tel" name="phone" autocomplete="tel"></label>
        <label><span>How would you like to help? *</span>
          <select name="partnershipType" required>
            <option value="">Select</option>
            <option>Health</option>
            <option>Equipment</option>
            <option>Travel &amp; Logistics</option>
            <option>Media &amp; Storytelling</option>
            <option>Other</option>
          </select>
        </label>
        <label><span>Tell us more *</span><textarea name="message" rows="4" required minlength="20" maxlength="800" placeholder="What you're proposing and how you'd like to be involved."></textarea></label>
        <label class="hp-field" aria-hidden="true" tabindex="-1"><span>Leave this field blank</span><input type="text" name="companyWebsite" tabindex="-1" autocomplete="off"></label>
        <output class="nomination-dialog-status" aria-live="polite"></output>
        <button class="nomination-dialog-submit" type="submit">Send partnership enquiry <i>↗</i></button>
      </form>
    </div>
  </dialog>`;

function bindPartnerDialog(dialog) {
  if (!dialog || dialog.dataset.bound === 'true') return;
  dialog.dataset.bound = 'true';

  const form = dialog.querySelector('#partner-dialog-form');
  const close = () => dialog.close();

  document.querySelectorAll('[data-open-partner]').forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });
  dialog.querySelectorAll('[data-close-partner]').forEach((button) => button.addEventListener('click', close));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const status = form.querySelector('.nomination-dialog-status');
    const submitButton = form.querySelector('.nomination-dialog-submit');

    const mailtoFallback = () => {
      const subject = encodeURIComponent('Expedition Partnership');
      const body = encodeURIComponent(
        `Name: ${data.get('contactName')}\nOrganisation: ${data.get('organisation') || 'Not provided'}\n`
        + `Email: ${data.get('email')}\nPhone: ${data.get('phone') || 'Not provided'}\n`
        + `Interested in: ${data.get('partnershipType')}\n\n${data.get('message')}`,
      );
      if (status) status.textContent = 'Opening your email app…';
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    submitButton && (submitButton.disabled = true);
    if (status) status.textContent = 'Submitting…';
    import('./appwrite-client.js').then(({ submitForm }) => submitForm('partnerships', {
      contactName: data.get('contactName'),
      organisation: data.get('organisation') || undefined,
      email: data.get('email'),
      phone: data.get('phone') || undefined,
      partnershipType: data.get('partnershipType'),
      message: data.get('message'),
    }, { honeypot: data.get('companyWebsite') })).then(() => {
      if (status) status.textContent = 'Thank you — our team will follow up by email.';
      setTimeout(() => { form.reset(); close(); if (status) status.textContent = ''; }, 1800);
    }).catch(() => {
      mailtoFallback();
    }).finally(() => {
      submitButton && (submitButton.disabled = false);
    });
  });
}

function init() {
  if (!document.querySelector('#partner-dialog')) {
    document.body.insertAdjacentHTML('beforeend', dialogMarkup());
  }
  bindPartnerDialog(document.querySelector('#partner-dialog'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
