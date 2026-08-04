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

  const updateReadinessLabels = form => {
    const commitment = form.querySelector('select[name="timeCommitment"]')?.closest('label')?.querySelector(':scope > span');
    if (commitment) commitment.textContent = 'Can you commit approximately one hour every morning? *';

    const availability = form.querySelector('select[name="availability"]')?.closest('label')?.querySelector(':scope > span');
    if (availability) availability.textContent = 'Available from 13–18 November 2026? *';
  };

  const removeLongAnswer = form => {
    form.querySelector('textarea[name="motivation"]')?.closest('label')?.remove();

    let summary = form.querySelector('input[name="motivation"][type="hidden"]');
    if (!summary) {
      summary = document.createElement('input');
      summary.type = 'hidden';
      summary.name = 'motivation';
      summary.value = 'Recent vitals not provided at initial application.';
      form.appendChild(summary);
    }
    return summary;
  };

  const removeAccuracyConsent = form => {
    form.querySelector('input[name="accuracy"]')?.closest('label')?.remove();
  };

  const vitalsMarkup = () => `
    <section class="recent-vitals-v19 field-wide" aria-labelledby="recent-vitals-title-v19">
      <header>
        <div>
          <small>Recent health readings</small>
          <h3 id="recent-vitals-title-v19">Recent vitals</h3>
        </div>
        <p>Share the latest readings available to you. Leave them blank if they have not been measured recently.</p>
      </header>

      <div class="recent-vitals-grid-v19">
        <label class="field">
          <span>Blood pressure, systolic <small>(mmHg)</small></span>
          <input type="number" name="bpSystolic" inputmode="numeric" placeholder="e.g. 124">
        </label>
        <label class="field">
          <span>Blood pressure, diastolic <small>(mmHg)</small></span>
          <input type="number" name="bpDiastolic" inputmode="numeric" placeholder="e.g. 82">
        </label>
        <label class="field">
          <span>Recent glucose reading <small>(mg/dL)</small></span>
          <input type="number" name="glucoseReading" step="1" inputmode="numeric" placeholder="e.g. 138">
        </label>
        <label class="field">
          <span>Glucose reading context</span>
          <select name="glucoseContext">
            <option value="">Select</option>
            <option value="Fasting">Fasting</option>
            <option value="Before a meal">Before a meal</option>
            <option value="Two hours after a meal">Two hours after a meal</option>
            <option value="Random">Random</option>
            <option value="Unsure">Unsure</option>
          </select>
        </label>
        <label class="field field-wide recent-vitals-date-v19">
          <span>Date of these readings <small>(if known)</small></span>
          <input type="date" name="vitalsMeasuredDate">
        </label>
      </div>

      <p class="recent-vitals-guidance-v19">These readings support initial screening only. They do not replace medical reports, physician review or final medical clearance.</p>
    </section>`;

  const addVitals = (form, hiddenSummary) => {
    const healthGrid = form.querySelector('[data-form-step="2"] .field-grid');
    if (!healthGrid || healthGrid.querySelector('.recent-vitals-v19')) return;

    healthGrid.insertAdjacentHTML('beforeend', vitalsMarkup());

    const systolic = form.querySelector('[name="bpSystolic"]');
    const diastolic = form.querySelector('[name="bpDiastolic"]');
    const glucose = form.querySelector('[name="glucoseReading"]');
    const context = form.querySelector('[name="glucoseContext"]');
    const measuredDate = form.querySelector('[name="vitalsMeasuredDate"]');

    const updateSummary = () => {
      const hasSystolic = Boolean(systolic?.value);
      const hasDiastolic = Boolean(diastolic?.value);
      const hasGlucose = Boolean(glucose?.value);

      systolic?.setCustomValidity(hasDiastolic && !hasSystolic ? 'Enter the systolic blood-pressure value as well.' : '');
      diastolic?.setCustomValidity(hasSystolic && !hasDiastolic ? 'Enter the diastolic blood-pressure value as well.' : '');
      context?.setCustomValidity(hasGlucose && !context.value ? 'Select the context for this glucose reading.' : '');

      const parts = [];
      if (hasSystolic || hasDiastolic) {
        parts.push(`Blood pressure: ${systolic?.value || 'not provided'}/${diastolic?.value || 'not provided'} mmHg`);
      }
      if (hasGlucose) {
        parts.push(`Glucose: ${glucose.value} mg/dL${context?.value ? ` (${context.value})` : ''}`);
      }
      if (measuredDate?.value) parts.push(`Reading date: ${measuredDate.value}`);

      hiddenSummary.value = parts.length
        ? `Recent vitals | ${parts.join(' | ')}`
        : 'Recent vitals not provided at initial application.';
    };

    [systolic, diastolic, glucose, context, measuredDate].forEach(field => {
      field?.addEventListener('input', updateSummary);
      field?.addEventListener('change', updateSummary);
    });

    form.addEventListener('submit', updateSummary, { capture: true });
    updateSummary();
    markDropdowns(form);
  };

  const updatePrivacyNotice = () => {
    const item = [...document.querySelectorAll('#dpdp-consent-dialog li')]
      .find(node => /diagnosis year|current treatment|HbA1c/i.test(node.textContent || ''));
    if (item) {
      item.textContent = 'Health-related data that you choose to provide, including diagnosis year, current treatment, HbA1c, recent blood-pressure readings, recent glucose readings and conditions selected in the initial health screen.';
    }
  };

  const updateApplicationForm = () => {
    if (!isApplicationPage()) return;
    const form = document.querySelector('#registration-form');
    if (!form) return;

    document.documentElement.classList.add('application-form-v19');
    const hiddenSummary = removeLongAnswer(form);
    removeAccuracyConsent(form);
    updateReadinessLabels(form);
    addVitals(form, hiddenSummary);
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
