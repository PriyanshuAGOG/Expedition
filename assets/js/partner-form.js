// "Support the Expedition" dialog (formerly "Become a partner"): injects the
// modal, binds its open/close triggers, and submits to the partnerships table.
// Mirrors the structure and CSS classes of the nomination dialog
// (feedback-content-v8.js) for a consistent look, with its own
// id/data-attributes so the two don't collide.
//
// The table/route/field names stay `partnerships`/`partner-*` on purpose —
// only user-facing copy was renamed, so no data migration is needed.

const CONTACT_EMAIL = 'nirogbhumi@gmail.com';

// Shared with the participant form: strip formatting, keep a leading +, and
// require 8-15 digits so "+91 98765 43210", "+91-98765-43210" and
// "(+91) 9876543210" all validate identically.
const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;
const normalisePhone = (value) => String(value || '').replace(/[\s()\-.]/g, '');

const dialogMarkup = () => `
  <dialog class="nomination-dialog" id="partner-dialog" aria-labelledby="partner-dialog-title">
    <div class="nomination-dialog-shell">
      <button class="nomination-dialog-close" type="button" data-close-partner aria-label="Close the Support the Expedition form">×</button>
      <div class="nomination-dialog-visual" aria-hidden="true">
        <img src="assets/sections/webp/11-expedition-team.webp" alt="" loading="lazy" decoding="async">
        <div></div>
        <span>Support<br>the expedition.</span>
      </div>
      <form class="nomination-dialog-form" id="partner-dialog-form">
        <p class="kicker">Support the Expedition</p>
        <h2 id="partner-dialog-title">Bring your support<br><em>to the journey.</em></h2>
        <p>Medical knowledge, equipment, travel, logistics or responsible storytelling — tell us how you'd like to help.</p>
        <label><span>Your name *</span><input name="contactName" autocomplete="name" required></label>
        <label><span>Organisation *</span><input name="organisation" autocomplete="organization" required aria-required="true"></label>
        <label><span>Email *</span><input type="email" name="email" autocomplete="email" required></label>
        <label><span>Phone *</span><input type="tel" name="phone" autocomplete="tel" required aria-required="true" inputmode="tel" placeholder="+91 98765 43210"></label>
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
        <button class="nomination-dialog-submit" type="submit">Send Support the Expedition enquiry <i>↗</i></button>
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

  // Organisation and phone are both required (second pass). `required` alone
  // covers "empty"; setCustomValidity adds the shape check for phone so
  // reportValidity() surfaces both through the browser's own accessible
  // error UI rather than a separate, unlabelled error region.
  const organisationInput = form?.querySelector('[name="organisation"]');
  const phoneInput = form?.querySelector('[name="phone"]');
  const validateOrganisation = () => {
    if (!organisationInput) return;
    organisationInput.setCustomValidity(
      organisationInput.value.trim() ? '' : 'Please enter your organization name.',
    );
  };
  const validatePhone = () => {
    if (!phoneInput) return;
    const raw = phoneInput.value.trim();
    if (!raw) {
      phoneInput.setCustomValidity('Please enter your phone number.');
      return;
    }
    phoneInput.setCustomValidity(
      PHONE_PATTERN.test(normalisePhone(raw))
        ? ''
        : 'Please enter a valid phone number, including the country code.',
    );
  };
  organisationInput?.addEventListener('input', validateOrganisation);
  phoneInput?.addEventListener('input', validatePhone);

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    validateOrganisation();
    validatePhone();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const status = form.querySelector('.nomination-dialog-status');
    const submitButton = form.querySelector('.nomination-dialog-submit');

    const mailtoFallback = () => {
      const subject = encodeURIComponent('Support the Expedition enquiry');
      const body = encodeURIComponent(
        `Name: ${data.get('contactName')}\nOrganisation: ${data.get('organisation')}\n`
        + `Email: ${data.get('email')}\nPhone: ${normalisePhone(data.get('phone'))}\n`
        + `Interested in: ${data.get('partnershipType')}\n\n${data.get('message')}`,
      );
      if (status) status.textContent = 'Opening your email app…';
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    submitButton && (submitButton.disabled = true);
    if (status) status.textContent = 'Submitting…';
    import('./appwrite-client.js').then(({ submitForm }) => submitForm('partnerships', {
      contactName: data.get('contactName'),
      organisation: String(data.get('organisation') || '').trim(),
      email: String(data.get('email') || '').trim().toLowerCase(),
      phone: normalisePhone(data.get('phone')),
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
