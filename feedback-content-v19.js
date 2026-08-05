(() => {
  'use strict';

  const updatePricingHeader = () => {
    const section = document.querySelector('#pricing');
    const heading = section?.querySelector('.fee-v11-heading');
    if (!section || !heading) return;

    section.classList.add('fee-journey-v19');
    heading.classList.add('fee-v11-heading-v19');

    const kicker = heading.querySelector('.kicker');
    if (kicker) kicker.textContent = 'Programme fee';

    const title = heading.querySelector('h2');
    if (title) title.innerHTML = 'A clear programme <em>fee.</em>';

    heading.querySelector('.fee-v14-stage-line')?.remove();
    heading.querySelectorAll(':scope > p:not(.kicker)').forEach(node => node.remove());
  };

  const isApplicationPage = () => document.body?.classList.contains('application-page');

  const markDropdowns = form => {
    form.querySelectorAll('select').forEach(select => {
      select.classList.add('application-select-v19');
      select.querySelector('option[value=""]')?.classList.add('select-placeholder-v19');
    });
  };

  const updatePrivacyNotice = () => {
    const item = [...document.querySelectorAll('#dpdp-consent-dialog li')]
      .find(node => /diagnosis year|current treatment|HbA1c/i.test(node.textContent || ''));
    if (item) {
      item.textContent = 'Health-related data that you choose to provide, including diagnosis year, current treatment, HbA1c, recent blood-pressure readings and conditions selected in the initial health screen.';
    }
  };

  // NOTE: this layer previously injected a duplicate "Recent vitals" card
  // (with its own bpSystolic/bpDiastolic/glucose fields alongside the ones
  // already in apply.html) and stripped out the motivation question and the
  // accuracy-consent checkbox. That directly conflicted with the explicit,
  // later request to keep systolic/diastolic as two plain required
  // questions with no card wrapper, no glucose fields, and to keep the
  // motivation question and consent checkboxes intact — so that behaviour
  // has been removed rather than left to fight with apply.html's own markup.
  const updateApplicationForm = () => {
    if (!isApplicationPage()) return;
    const form = document.querySelector('#registration-form');
    if (!form) return;

    document.documentElement.classList.add('application-form-v19');
    markDropdowns(form);
    updatePrivacyNotice();
  };

  const run = () => {
    updatePricingHeader();
    updateApplicationForm();
    document.documentElement.classList.add('production-polish-v19');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
