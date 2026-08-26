// World Diabetes Day webinar registration form (webinar.html). Standalone
// page script — this page sits outside the legacy script.js pipeline (see
// policies.css header), so this binds the static form markup directly
// instead of injecting a dialog like partner-form.js does. Submits to the
// `webinarRegistrations` Appwrite table, shown in the admin panel as its
// own "Webinar Registrations" tab.

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

    const mailtoFallback = () => {
      const subject = encodeURIComponent('World Diabetes Day webinar registration');
      const body = encodeURIComponent(
        `Name: ${data.get('fullName')}\nEmail: ${data.get('email')}\n`
        + `Phone: ${normalisePhone(data.get('phone'))}`,
      );
      setStatus('Opening your email app…');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    submitButton && (submitButton.disabled = true);
    setStatus('Submitting…');
    import('./appwrite-client.js').then(({ submitForm }) => submitForm('webinarRegistrations', {
      fullName: String(data.get('fullName') || '').trim(),
      email: String(data.get('email') || '').trim().toLowerCase(),
      phone: normalisePhone(data.get('phone')),
    }, { honeypot: data.get('companyWebsite') })).then(() => {
      setStatus('You’re registered — we’ll be in touch with the webinar link and any updates.');
      form.reset();
    }).catch(() => {
      mailtoFallback();
    }).finally(() => {
      submitButton && (submitButton.disabled = false);
    });
  });
}

function init() {
  bindForm(document.querySelector('#webinar-registration-form'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
