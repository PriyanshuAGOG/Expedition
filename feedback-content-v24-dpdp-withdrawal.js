(() => {
  'use strict';

  const PRIVACY_EMAIL = 'priyanshu@nirogbhumi.com';
  const OPERATING_ADDRESS = '18, Keshev Vihar, Gopalpura Bypass, Durgapura, Jaipur - 302018, Rajasthan, India';
  const DIALOG_ID = 'consent-withdrawal-dialog';

  const normaliseEmail = value => String(value || '').trim().toLowerCase();
  const normalisePhone = value => String(value || '').trim().replace(/[\s().-]+/g, '');

  const withdrawalDialogMarkup = () => `
    <dialog class="consent-withdrawal-dialog" id="${DIALOG_ID}" aria-labelledby="consent-withdrawal-title">
      <div class="consent-withdrawal-shell">
        <header class="consent-withdrawal-header">
          <div>
            <p class="kicker">Privacy request</p>
            <h2 id="consent-withdrawal-title">Withdraw consent</h2>
          </div>
          <button type="button" class="consent-withdrawal-close" data-close-consent-withdrawal aria-label="Close consent withdrawal form">×</button>
        </header>

        <form class="consent-withdrawal-form" data-consent-withdrawal-form novalidate>
          <label>
            <span>Name *</span>
            <input name="fullName" autocomplete="name" maxlength="200" required>
          </label>

          <label>
            <span>Email used to register *</span>
            <input type="email" name="email" autocomplete="email" maxlength="320" required>
          </label>

          <label>
            <span>Phone number used to register *</span>
            <input type="tel" name="phone" autocomplete="tel" maxlength="40" required>
          </label>

          <label class="consent-withdrawal-confirmation">
            <input type="checkbox" name="confirmedWithdrawal" required>
            <span>I want to withdraw my consent for the processing of my personal data by Nirog Bhumi. *</span>
          </label>

          <label class="consent-withdrawal-hp" aria-hidden="true" tabindex="-1">
            <span>Leave this field blank</span>
            <input type="text" name="website" tabindex="-1" autocomplete="off">
          </label>

          <div class="consent-withdrawal-status" data-consent-withdrawal-status role="status" aria-live="polite"></div>
          <button type="submit" class="consent-withdrawal-submit">Submit withdrawal request</button>
        </form>
      </div>
    </dialog>`;

  const openDialog = dialog => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');

    window.setTimeout(() => {
      dialog.querySelector('input[name="fullName"]')?.focus();
    }, 0);
  };

  const closeDialog = dialog => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  const buildFallbackEmail = ({ fullName, email, phone }) => {
    const subject = 'DPDP Consent Withdrawal Request';
    const body = [
      'I wish to withdraw my consent for the processing of my personal data by Nirog Bhumi.',
      '',
      `Name: ${fullName}`,
      `Registered email: ${email}`,
      `Registered phone: ${phone}`,
    ].join('\n');

    return `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const bindWithdrawalForm = dialog => {
    const form = dialog.querySelector('[data-consent-withdrawal-form]');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', async event => {
      event.preventDefault();

      const status = form.querySelector('[data-consent-withdrawal-status]');
      const submit = form.querySelector('.consent-withdrawal-submit');
      status.textContent = '';

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      if (data.get('website')) {
        status.textContent = 'Your request has been received.';
        form.reset();
        return;
      }

      const request = {
        fullName: String(data.get('fullName') || '').trim(),
        email: normaliseEmail(data.get('email')),
        phone: normalisePhone(data.get('phone')),
        confirmedWithdrawal: data.get('confirmedWithdrawal') === 'on',
        requestedAt: new Date().toISOString(),
        source: 'web_consent_withdrawal',
      };

      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Submitting…';

      try {
        const { submitForm } = await import('./assets/js/appwrite-client.js');
        await submitForm('consentWithdrawals', request);
        form.reset();
        status.innerHTML = '<strong>Request received.</strong> Nirog Bhumi will verify the registration details and process the consent-withdrawal request in accordance with applicable law.';
        submit.textContent = 'Request submitted';
      } catch (error) {
        console.error('[DPDP] Consent withdrawal submission failed', error);
        const fallback = buildFallbackEmail(request);
        status.innerHTML = `We could not record the request online. <a href="${fallback}">Send the same withdrawal request by email</a>.`;
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = 'Try again';
      }
    });
  };

  const ensureWithdrawalDialog = () => {
    let dialog = document.querySelector(`#${DIALOG_ID}`);
    if (!dialog) {
      document.body.insertAdjacentHTML('beforeend', withdrawalDialogMarkup());
      dialog = document.querySelector(`#${DIALOG_ID}`);
    }
    if (!dialog) return null;

    dialog.querySelectorAll('[data-close-consent-withdrawal]').forEach(button => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => closeDialog(dialog));
    });

    if (dialog.dataset.cancelBound !== 'true') {
      dialog.dataset.cancelBound = 'true';
      dialog.addEventListener('click', event => {
        if (event.target === dialog) closeDialog(dialog);
      });
    }

    bindWithdrawalForm(dialog);
    return dialog;
  };

  const bindOpenControls = dialog => {
    document.querySelectorAll('[data-open-consent-withdrawal]').forEach(control => {
      if (control.dataset.bound === 'true') return;
      control.dataset.bound = 'true';
      control.addEventListener('click', event => {
        event.preventDefault();
        openDialog(dialog);
      });
    });
  };

  const updateDpdpNotice = () => {
    const dpdp = document.querySelector('#dpdp-consent-dialog');
    if (!dpdp) return;

    const version = dpdp.querySelector('.dpdp-dialog-header small');
    if (version) version.textContent = 'Effective 8 August 2026 · Version 1.3';

    const sections = [...dpdp.querySelectorAll('.dpdp-dialog-body > section')];
    const sectionOne = sections.find(section => /^1\./.test(section.querySelector('h3')?.textContent || ''));
    if (sectionOne) {
      const firstParagraph = sectionOne.querySelector('p');
      if (firstParagraph) {
        firstParagraph.textContent = `Nirog Bhumi, operated by Nirog Bhumi Private Limited, operating at ${OPERATING_ADDRESS}, is the Data Fiduciary responsible for the personal data collected through this application.`;
      }
    }

    const sectionEight = sections.find(section => /^8\./.test(section.querySelector('h3')?.textContent || ''));
    if (sectionEight) {
      sectionEight.innerHTML = `
        <h3>8. Your rights and withdrawal of consent</h3>
        <p>Subject to applicable law, you may exercise rights relating to your personal data, including requesting:</p>
        <ul>
          <li>information regarding your personal data and its processing;</li>
          <li>correction, completion or updating of inaccurate or incomplete information;</li>
          <li>erasure of personal data where applicable;</li>
          <li>grievance redressal;</li>
          <li>withdrawal of consent; and</li>
          <li>nomination of another person to exercise applicable rights in circumstances recognised by law.</li>
        </ul>
        <p>Where processing is based on your consent, you may withdraw that consent at any time. Nirog Bhumi has developed and made available an accessible consent-withdrawal mechanism through this website so that a withdrawal request can be initiated using the same contact details with which you registered.</p>
        <p><button type="button" class="dpdp-inline-withdrawal-link" data-open-consent-withdrawal>Open Consent Withdrawal Form</button></p>
        <p>The form asks only for your name, registered email address, registered phone number and confirmation that you wish to withdraw consent. These details are used to identify the relevant record and process the request. You may alternatively send a withdrawal request to <a href="mailto:${PRIVACY_EMAIL}?subject=DPDP%20Consent%20Withdrawal">${PRIVACY_EMAIL}</a>.</p>
        <p>After receipt and reasonable verification of the request, Nirog Bhumi will cease processing that depends on the withdrawn consent and will take such erasure, processor-notification or other steps as are required under applicable law, except where continued processing or retention is required or otherwise permitted by law. Withdrawal does not affect processing lawfully undertaken before the withdrawal became effective.</p>
        <p>Where particular personal or health information is necessary to assess, screen or administer your application or participation, withdrawal may mean that Nirog Bhumi is unable to continue processing the application or permit further participation.</p>`;
    }
  };

  const addFooterControl = () => {
    if (document.body?.classList.contains('application-page')) return;
    const footerBottom = document.querySelector('.footer-v11-bottom');
    if (!footerBottom || footerBottom.querySelector('[data-open-consent-withdrawal]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'footer-consent-withdrawal-link';
    button.dataset.openConsentWithdrawal = '';
    button.textContent = 'Withdraw consent';
    footerBottom.appendChild(button);
  };

  const run = () => {
    updateDpdpNotice();
    addFooterControl();
    const dialog = ensureWithdrawalDialog();
    bindOpenControls(dialog);
    document.documentElement.classList.add('dpdp-withdrawal-v13-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
