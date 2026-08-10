// Privacy & Consent Withdrawal request form (consent-withdrawal.html).
// Standalone page script — this page sits outside the legacy script.js
// pipeline (see policies.css header), so this binds the static form
// markup directly instead of injecting a dialog like partner-form.js does.
// Submits to the `privacyRequests` Appwrite table for internal review.

const CONTACT_EMAIL = 'priyanshu@nirogbhumi.com';

const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;
const normalisePhone = (value) => String(value || '').replace(/[\s()\-.]/g, '');

function bindForm(form) {
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const status = form.querySelector('.policy-form-status');
  const submitButton = form.querySelector('.policy-form-submit');
  const phoneInput = form.querySelector('[name="phone"]');

  const validatePhone = () => {
    if (!phoneInput) return;
    const raw = phoneInput.value.trim();
    phoneInput.setCustomValidity(
      !raw || PHONE_PATTERN.test(normalisePhone(raw))
        ? ''
        : 'Please enter a valid phone number, including the country code.',
    );
  };
  phoneInput?.addEventListener('input', validatePhone);

  const setStatus = (text, tone) => {
    if (!status) return;
    status.textContent = text;
    if (tone) status.setAttribute('data-tone', tone); else status.removeAttribute('data-tone');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validatePhone();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const requestType = data.get('requestType');

    const mailtoFallback = () => {
      const subject = encodeURIComponent(`Privacy request: ${requestType}`);
      const body = encodeURIComponent(
        `Name: ${data.get('fullName')}\nEmail: ${data.get('email')}\n`
        + `Phone: ${normalisePhone(data.get('phone'))}\nRequest type: ${requestType}\n`
        + `Application reference: ${data.get('applicationReference') || '—'}\n\n${data.get('details')}`,
      );
      setStatus('Opening your email app…');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    submitButton && (submitButton.disabled = true);
    setStatus('Submitting…');
    import('./appwrite-client.js').then(({ submitForm }) => submitForm('privacyRequests', {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim().toLowerCase(),
      phone: normalisePhone(data.get('phone')),
      requestType,
      applicationReference: String(data.get('applicationReference') || '').trim(),
      details: data.get('details'),
    }, { honeypot: data.get('companyWebsite') })).then(() => {
      setStatus('Thank you — we’ve received your request and will respond by email within a reasonable time.');
      form.reset();
    }).catch(() => {
      mailtoFallback();
    }).finally(() => {
      submitButton && (submitButton.disabled = false);
    });
  });
}

function init() {
  bindForm(document.querySelector('#privacy-request-form'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
