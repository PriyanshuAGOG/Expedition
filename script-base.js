(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.parallax-hero');
  const depthSections = [...document.querySelectorAll('[data-depth-section]')];
  const mapStage = document.querySelector('.map-stage');
  const briefingMap = document.querySelector('.expedition-map');
  const mapStops = [...document.querySelectorAll('.map-stop')];
  const trailStory = document.querySelector('.trail-story');
  const routeMoments = [...document.querySelectorAll('.route-moment')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoothstep = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

  let targetProgress = 0, currentProgress = 0;
  let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
  let frameId = 0, measureFrameId = 0, lastFrameTime = performance.now();
  let updateFloatingNav = () => {};

  const requestRender = () => {
    if (!frameId && !document.hidden) frameId = requestAnimationFrame(render);
  };

  const measure = () => {
    const heroRect = hero?.getBoundingClientRect();
    const documentDistance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const sectionRects = depthSections.map(section => [section, section.getBoundingClientRect()]);
    if (hero) {
      targetProgress = clamp(-heroRect.top / Math.max(1, hero.offsetHeight - innerHeight));
    }
    root.style.setProperty('--page-progress', clamp(scrollY / documentDistance).toFixed(5));
    sectionRects.forEach(([section, rect]) => {
      const p = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      section.style.setProperty('--section-y', (p * 2 - 1).toFixed(4));
      section.style.setProperty('--section-shift-bg', `${((p * 2 - 1) * -2.5).toFixed(4)}svh`);
      section.style.setProperty('--section-shift-frame', `${((p * 2 - 1) * 1.6).toFixed(4)}svh`);
      section.style.setProperty('--section-shift-seam', `${((p * 2 - 1) * .7).toFixed(4)}svh`);
    });
    if (mapStage && briefingMap) {
      const rect = mapStage.getBoundingClientRect();
      const mapProgress = clamp((innerHeight * .72 - rect.top) / Math.max(1, rect.height - innerHeight * .28));
      briefingMap.style.setProperty('--map-progress', mapProgress.toFixed(4));
      const mobileMapStop = Math.min(mapStops.length - 1, Math.max(0, Math.floor(mapProgress * mapStops.length)));
      mapStops.forEach((stop, index) => {
        const active = innerWidth <= 680 ? index === mobileMapStop : mapProgress >= .08 + index * .22;
        stop.classList.toggle('map-active', active);
      });
    }
    if (trailStory) {
      const rect = trailStory.getBoundingClientRect();
      const trailProgress = clamp((innerHeight * .7 - rect.top) / Math.max(1, rect.height - innerHeight * .6));
      const trailTrack = innerWidth <= 680 ? trailProgress : clamp((-rect.top - innerHeight * .92) / Math.max(1, rect.height - innerHeight * 1.92));
      trailStory.style.setProperty('--trail-progress', trailProgress.toFixed(4));
      trailStory.style.setProperty('--trail-track', trailTrack.toFixed(4));
      trailStory.style.setProperty('--trail-x', `${(trailTrack * -400).toFixed(3)}vw`);
      trailStory.style.setProperty('--trail-fill', `${(trailTrack * 100).toFixed(2)}%`);
      trailStory.style.setProperty('--trail-dot', `${(8 + trailTrack * 84).toFixed(3)}vw`);
      if (innerWidth > 680) routeMoments.forEach((moment, index) => moment.classList.toggle('route-active', trailTrack >= Math.max(0, index / 4 - .035)));
    }
    updateFloatingNav();
  };

  const scheduleMeasure = () => {
    if (measureFrameId || document.hidden) return;
    measureFrameId = requestAnimationFrame(() => {
      measureFrameId = 0;
      measure();
      requestRender();
    });
  };

  function render(time = performance.now()) {
    frameId = 0;
    const phone = innerWidth <= 680;
    const delta = Math.min(40, Math.max(8, time - lastFrameTime || 16.667));
    lastFrameTime = time;
    const scrollEase = reducedMotion ? 1 : 1 - Math.pow(1 - (phone ? .27 : .24), delta / 16.667);
    const pointerEase = reducedMotion ? 1 : 1 - Math.pow(1 - .085, delta / 16.667);
    currentProgress += (targetProgress - currentProgress) * scrollEase;
    mouseX += (targetMouseX - mouseX) * pointerEase;
    mouseY += (targetMouseY - mouseY) * pointerEase;
    const descent = clamp(currentProgress / .76);
    const exit = smoothstep(phone ? .88 : .79, 1, currentProgress);
    root.style.setProperty('--d', descent.toFixed(5));
    root.style.setProperty('--exit', exit.toFixed(5));
    root.style.setProperty('--mx', mouseX.toFixed(4));
    root.style.setProperty('--my', mouseY.toFixed(4));
    root.style.setProperty('--back-o', (1 - smoothstep(.47, .72, currentProgress)).toFixed(4));
    root.style.setProperty('--middle-o', (1 - smoothstep(.57, .82, currentProgress)).toFixed(4));
    root.style.setProperty('--front-o', (1 - smoothstep(.69, .93, currentProgress)).toFixed(4));
    const vw = value => `${value.toFixed(4)}vw`;
    const svh = value => `${value.toFixed(4)}svh`;
    root.style.setProperty('--bg-x', vw(mouseX * -.16)); root.style.setProperty('--bg-y', svh(descent * -2.2 + mouseY * -.12));
    root.style.setProperty('--sun-x', vw(mouseX * -.25)); root.style.setProperty('--sun-y', svh(descent * -2));
    root.style.setProperty('--mist-a-x', vw(descent * -5 + mouseX * .3)); root.style.setProperty('--mist-a-y', svh(descent * -2)); root.style.setProperty('--mist-a-o', Math.max(0, .65 - exit * .45).toFixed(4));
    root.style.setProperty('--mist-b-x', vw(descent * 7 + mouseX * -.2)); root.style.setProperty('--mist-b-y', svh(descent * -3.5)); root.style.setProperty('--mist-b-o', Math.max(0, .46 - exit * .38).toFixed(4));
    root.style.setProperty('--far-left-x', vw(descent * .7 + mouseX * -.24)); root.style.setProperty('--far-right-x', vw(descent * -.7 + mouseX * -.24)); root.style.setProperty('--far-y', svh(descent * (phone ? -3.2 : -2.4) + mouseY * -.15));
    root.style.setProperty('--mid-left-x', vw(descent * 1.2 + mouseX * -.42)); root.style.setProperty('--mid-right-x', vw(descent * -1.2 + mouseX * -.42)); root.style.setProperty('--mid-y', svh(-2 + descent * (phone ? -5.3 : -3.8) + mouseY * -.24));
    root.style.setProperty('--near-left-x', vw(descent * 1.8 + mouseX * -.68)); root.style.setProperty('--near-right-x', vw(descent * -1.8 + mouseX * -.68)); root.style.setProperty('--near-y', svh(-4 + descent * (phone ? -6.4 : -5) + mouseY * -.38));
    root.style.setProperty('--foreground-x', vw(mouseX * -.95)); root.style.setProperty('--foreground-y', svh(-1 + descent * (phone ? -8 : -4.8) + mouseY * -.55));
    root.style.setProperty('--cloud-far-x', vw(descent * -5.5 + mouseX * -.18)); root.style.setProperty('--cloud-far-y', svh(descent * -4 + mouseY * -.12));
    root.style.setProperty('--cloud-mid-x', vw(descent * 6.5 + mouseX * -.34)); root.style.setProperty('--cloud-mid-y', svh(descent * -7 + mouseY * -.2));
    root.style.setProperty('--cloud-front-x', vw(descent * -9 + mouseX * -.58)); root.style.setProperty('--cloud-front-y', svh(descent * -10 + mouseY * -.32));
    root.style.setProperty('--title-back-x', vw(mouseX * .12)); root.style.setProperty('--title-back-y', svh(descent * (phone ? 48 : 52) + mouseY * .1));
    root.style.setProperty('--title-middle-x', vw(mouseX * .18)); root.style.setProperty('--title-middle-y', svh(descent * (phone ? 56 : 61) + mouseY * .14));
    root.style.setProperty('--title-front-x', vw(mouseX * .24)); root.style.setProperty('--title-front-y', svh(descent * (phone ? 64 : 69) + mouseY * .2));
    root.style.setProperty('--rays-o', Math.max(0, .3 - exit * .22).toFixed(4)); root.style.setProperty('--rays-x', vw(descent * -1)); root.style.setProperty('--rays-y', svh(descent));
    root.style.setProperty('--chrome-o', Math.max(0, 1 - exit * .92).toFixed(4)); root.style.setProperty('--scroll-o', Math.max(0, 1 - descent * 1.55).toFixed(4));
    const unsettled = Math.abs(targetProgress - currentProgress) > .00012 || Math.abs(targetMouseX - mouseX) > .0008 || Math.abs(targetMouseY - mouseY) > .0008;
    if (unsettled) requestRender();
  }

  if (finePointer) {
    addEventListener('pointermove', event => {
      targetMouseX = clamp((event.clientX / innerWidth - .5) * 2, -1, 1);
      targetMouseY = clamp((event.clientY / innerHeight - .5) * 2, -1, 1);
      requestRender();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { targetMouseX = 0; targetMouseY = 0; requestRender(); });
  }
  addEventListener('scroll', scheduleMeasure, { passive: true });
  addEventListener('resize', scheduleMeasure, { passive: true });

  const revealElements = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) revealElements.forEach(el => el.classList.add('visible'));
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible'); observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px 22% 0px', threshold: .02 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  if (routeMoments.length && 'IntersectionObserver' in window) {
    const routeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('route-active');
    }), { rootMargin: '-18% 0px -18% 0px', threshold: .04 });
    routeMoments.forEach(moment => routeObserver.observe(moment));
  }

  /* Authentic field-recorded ambience. Browsers never allow audible autoplay before any user
     gesture on the page, full stop -- no script can honestly bypass that. The closest possible
     approximation of "plays the moment the page loads": start MUTED playback immediately (always
     permitted), so the instant a gesture happens the sound is a synchronous mute-toggle away with
     no further play()/AudioContext delay.
     The source recording is mixed quiet (~-31dBFS RMS), so a Web Audio gain stage brings it up to a
     comfortable ambience level with a limiter as a safety net against clipping. */
  const ambientAudio = document.querySelector('#nature-audio');
  const ambientControl = document.querySelector('.ambient-control');
  const ambientLabel = ambientControl?.querySelector('[data-ambient-label]');
  let natureOn = true, audible = false, audioCtx, audioGraphReady = false;
  const setAmbientUI = (playing, label = playing ? 'Sound on' : 'Sound ready') => {
    ambientControl?.setAttribute('aria-pressed', String(playing));
    ambientControl?.setAttribute('aria-label', playing ? 'Mute nature ambience' : 'Play nature ambience');
    if (ambientLabel) ambientLabel.textContent = label;
  };
  const ensureAudioGraph = () => {
    /* Building the graph before any gesture leaves the AudioContext permanently suspended in some
       browsers even after a later resume() inside a real gesture, so this only ever runs once
       inside one -- ensureAudioGraph() itself is only ever called from a gesture handler below. */
    if (audioGraphReady || !ambientAudio) return;
    audioGraphReady = true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
      const source = audioCtx.createMediaElementSource(ambientAudio);
      const gain = audioCtx.createGain();
      gain.gain.value = 2.8;
      const limiter = audioCtx.createDynamicsCompressor();
      limiter.threshold.value = -6; limiter.knee.value = 4; limiter.ratio.value = 12; limiter.attack.value = .003; limiter.release.value = .25;
      source.connect(gain).connect(limiter).connect(audioCtx.destination);
    } catch (_) { /* Web Audio unavailable: element still plays at its native (quieter) volume */ }
  };
  const markAudible = () => { audible = true; setAmbientUI(true); removeNatureActivation(); };
  /* Start muted playback the instant the audio element can (no gesture required for this).
     Deliberately does NOT try to flip muted=false on its own afterwards: Chrome's autoplay
     policy explicitly warns that programmatically unmuting an autoplaying element without a
     user gesture can get the browser to pause it outright, which would silently break the
     muted-priming benefit too. Becoming audible only ever happens inside a real gesture,
     below, where it's unconditionally allowed. */
  function primeNature() {
    if (!ambientAudio || !natureOn) return;
    ambientAudio.volume = 1;
    ambientAudio.muted = true;
    ambientAudio.play().catch(() => {});
  }
  /* pointerdown/mousedown/touchstart/touchend/keydown/click are the gestures browsers treat as
     activation; scroll/wheel are included too so a later real click after an ignored scroll still
     starts playback immediately (no need to remove the harmless extra listeners). */
  const activationEvents = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'click', 'scroll', 'wheel'];
  const removeNatureActivation = () => activationEvents.forEach(type => window.removeEventListener(type, onActivationEvent));
  let unlocking = false;
  function onActivationEvent() {
    if (audible || unlocking || !natureOn || !ambientAudio) return;
    unlocking = true;
    ensureAudioGraph();
    ambientAudio.muted = false;
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    if (ambientAudio.paused) { ambientAudio.play().then(markAudible).catch(() => { unlocking = false; }); }
    else { markAudible(); unlocking = false; }
  }
  activationEvents.forEach(type => window.addEventListener(type, onActivationEvent, { passive: true }));
  ambientControl?.addEventListener('click', () => {
    if (natureOn && ambientAudio && !ambientAudio.paused && !ambientAudio.muted) {
      natureOn = false; audible = false; ambientAudio.pause(); setAmbientUI(false, 'Sound off');
    } else {
      natureOn = true; onActivationEvent();
    }
  });
  /* Sound defaults on: the very first gesture anywhere on the page (scroll included,
     see activationEvents above) is what actually starts it, since browsers never allow
     audible autoplay before one. primeNature() below only gets the muted element playing
     immediately so that first gesture is a synchronous unmute with no play() delay. */
  setAmbientUI(false, 'Sound ready');
  primeNature();

  const archiveButtons = [...document.querySelectorAll('[data-filter]')];
  const archiveCards = [...document.querySelectorAll('[data-category]')];
  archiveButtons.forEach(button => button.addEventListener('click', () => {
    archiveButtons.forEach(item => item.classList.toggle('active', item === button));
    archiveCards.forEach(card => card.classList.toggle('filtered-out', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter));
  }));

  const form = document.querySelector('#registration-form');
  if (form) {
    const steps = [...form.querySelectorAll('[data-form-step]')];
    const indicators = [...document.querySelectorAll('[data-step-indicator]')];
    const backButton = form.querySelector('.form-back'), nextButton = form.querySelector('.form-next'), submitButton = form.querySelector('.form-submit');
    const errors = form.querySelector('.form-errors'), confirmation = document.querySelector('.form-confirmation');
    const reviewScreen = document.querySelector('.form-review');
    const reviewList = reviewScreen?.querySelector('[data-review-list]');
    const motivation = form.querySelector('textarea[name="motivation"]'), counter = form.querySelector('[data-count]');
    const fileInput = form.querySelector('[data-file-input]');
    const fileListEl = form.querySelector('[data-file-list]');
    let currentStep = 1;
    let selectedFiles = [];
    let lastSubmittedSnapshot = null;
    // Latches true once the server confirms a write, so nothing can submit
    // a second time without an explicit "Edit Application".
    let submitted = false;
    const referenceEl = confirmation?.querySelector('[data-application-reference]');

    // Normalisation is shared with the duplicate check enforced by the
    // database's unique indexes — the same value that is compared is the
    // value that gets stored, so formatting variants can't slip past.
    const normaliseEmail = value => String(value || '').trim().toLowerCase();
    // Strip spaces, brackets, hyphens and dots but keep a leading "+", so
    // "+91 98765 43210", "+91-98765-43210" and "(+91) 9876543210" all reduce
    // to "+919876543210".
    const normalisePhone = value => String(value || '').trim().replace(/[\s()\-.]/g, '');
    const isDuplicateError = err => {
      const message = String(err?.message || '');
      return err?.code === 409
        || /already exists|duplicate|unique/i.test(message);
    };

    // One stable id per browser tab/session: the review → edit → resubmit
    // flow always upserts this same application row instead of creating a
    // new one each time "Submit Application" is pressed.
    const APPLICATION_ID_KEY = 'expedition-application-id';
    let applicationId = sessionStorage.getItem(APPLICATION_ID_KEY);
    if (!applicationId) {
      applicationId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `app-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(APPLICATION_ID_KEY, applicationId);
    }

    const showStep = (step, moveFocus = true) => {
      currentStep = clamp(step, 1, steps.length);
      steps.forEach(panel => { const active = +panel.dataset.formStep === currentStep; panel.hidden = !active; panel.classList.toggle('active', active); });
      indicators.forEach(indicator => indicator.classList.toggle('active', +indicator.dataset.stepIndicator <= currentStep));
      backButton.hidden = currentStep === 1; nextButton.hidden = currentStep === steps.length; submitButton.hidden = currentStep !== steps.length; errors.textContent = '';
      if (moveFocus) form.querySelector(`[data-form-step="${currentStep}"] legend`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    };
    const validateCurrentStep = () => {
      const stepEl = form.querySelector(`[data-form-step="${currentStep}"]`);
      const fields = [...stepEl.querySelectorAll('[required]')]; let firstInvalid, invalidCount = 0;
      fields.forEach(field => { const valid = field.checkValidity(); field.closest('.field')?.classList.toggle('invalid', !valid); if (!valid) { invalidCount += 1; firstInvalid ||= field; } });
      const requiredGroup = stepEl.querySelector('[data-required-group]');
      if (requiredGroup) {
        const groupName = requiredGroup.dataset.requiredGroup;
        const anyChecked = [...requiredGroup.querySelectorAll(`input[name="${groupName}"]`)].some(input => input.checked);
        requiredGroup.classList.toggle('invalid', !anyChecked);
        if (!anyChecked) { invalidCount += 1; firstInvalid ||= requiredGroup.querySelector(`input[name="${groupName}"]`); }
      }
      if (!invalidCount) { errors.textContent = ''; return true; }
      errors.textContent = `Please complete ${invalidCount} required ${invalidCount === 1 ? 'field' : 'fields'} before continuing.`;
      firstInvalid?.focus({ preventScroll: true }); firstInvalid?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }); return false;
    };
    nextButton.addEventListener('click', () => { if (validateCurrentStep()) showStep(currentStep + 1); });
    backButton.addEventListener('click', () => showStep(currentStep - 1));
    form.addEventListener('input', event => {
      event.target.closest('.field')?.classList.remove('invalid');
      event.target.closest('[data-required-group]')?.classList.remove('invalid');
      if (event.target === motivation && counter) counter.textContent = motivation.value.length;
    });
    const none = form.querySelector('input[name="conditions"][value="none"]'), conditions = [...form.querySelectorAll('input[name="conditions"]')];
    conditions.forEach(input => input.addEventListener('change', () => { if (input === none && input.checked) conditions.filter(item => item !== none).forEach(item => item.checked = false); else if (input.checked && none) none.checked = false; }));

    const MAX_FILE_BYTES = 15 * 1024 * 1024;
    const ACCEPTED_FILE_PATTERN = /\.(pdf|jpe?g|png)$/i;
    const renderFileList = () => {
      if (!fileListEl) return;
      fileListEl.replaceChildren();
      selectedFiles.forEach((file, index) => {
        const item = document.createElement('li');
        const name = document.createElement('span');
        name.textContent = file.name;
        const size = document.createElement('small');
        size.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.addEventListener('click', () => { selectedFiles.splice(index, 1); renderFileList(); });
        item.append(name, size, removeBtn);
        fileListEl.append(item);
      });
    };
    fileInput?.addEventListener('change', () => {
      const incoming = [...fileInput.files];
      incoming.forEach(file => {
        if (file.size > MAX_FILE_BYTES) { errors.textContent = `"${file.name}" is larger than 15MB and was not added.`; return; }
        if (!ACCEPTED_FILE_PATTERN.test(file.name)) { errors.textContent = `"${file.name}" is not a supported file type (PDF, JPG or PNG only).`; return; }
        selectedFiles.push(file);
      });
      fileInput.value = '';
      renderFileList();
    });

    const REVIEW_FIELD_LABELS = {
      fullName: 'Full name', email: 'Email', phone: 'Phone / WhatsApp', age: 'Age', city: 'City', state: 'State / region', country: 'Country',
      diagnosisYear: 'Year diagnosed with Type 2 diabetes', treatment: 'Current treatment',
      bpSystolic: 'Blood pressure — systolic (mmHg)', bpDiastolic: 'Blood pressure — diastolic (mmHg)',
      timeCommitment: 'Can commit about one hour each morning', availability: 'Available Nov 12–19, 2026',
      motivation: 'Why you want to join', emergencyName: 'Emergency contact name', emergencyPhone: 'Emergency contact phone', emergencyRelationship: 'Relationship to you',
    };
    const buildReview = () => {
      if (!reviewList) return;
      const data = new FormData(form);
      reviewList.replaceChildren();
      const addRow = (label, value) => {
        const dt = document.createElement('dt'); dt.textContent = label;
        const dd = document.createElement('dd'); dd.textContent = value;
        reviewList.append(dt, dd);
      };
      Object.entries(REVIEW_FIELD_LABELS).forEach(([key, label]) => {
        const value = data.get(key);
        if (value) addRow(label, String(value));
      });
      const diagnosedConditions = data.getAll('conditions');
      if (diagnosedConditions.length) addRow('Diagnosed conditions', diagnosedConditions.join(', '));
      addRow('Medical reports', selectedFiles.length ? selectedFiles.map(file => file.name).join(', ') : 'None uploaded');
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateCurrentStep()) return;
      buildReview();
      form.hidden = true;
      if (reviewScreen) { reviewScreen.hidden = false; reviewScreen.focus(); }
    });

    reviewScreen?.querySelector('[data-edit-review]')?.addEventListener('click', () => {
      if (reviewScreen) reviewScreen.hidden = true;
      form.hidden = false;
      showStep(steps.length);
    });

    const submitReviewButton = reviewScreen?.querySelector('[data-submit-review]');
    submitReviewButton?.addEventListener('click', async () => {
      if (submitted || submitReviewButton.disabled) return;
      submitReviewButton.disabled = true;
      const originalLabel = submitReviewButton.textContent;
      submitReviewButton.textContent = 'Submitting…';
      errors.textContent = '';
      try {
        const { submitForm, uploadFile } = await import('./assets/js/appwrite-client.js');
        const data = new FormData(form);
        const numberOrUndefined = name => { const value = data.get(name); return value === null || value === '' ? undefined : Number(value); };

        const newFiles = selectedFiles.filter(file => !file.__uploadedId);
        const uploadedIds = [];
        for (const file of newFiles) {
          // Sequential on purpose: keeps upload order predictable and avoids
          // bursting many concurrent requests against the uploads bucket.
          // eslint-disable-next-line no-await-in-loop
          const id = await uploadFile(file);
          file.__uploadedId = id;
          uploadedIds.push(id);
        }

        const values = {
          fullName: data.get('fullName'),
          // Stored normalised so the database's unique indexes treat
          // "Priyanshu@Example.com" and "priyanshu@example.com", or
          // "+91 98765 43210" and "(+91) 9876543210", as one person.
          email: normaliseEmail(data.get('email')), phone: normalisePhone(data.get('phone')),
          age: numberOrUndefined('age'), city: data.get('city'), state: data.get('state'), country: data.get('country'),
          diagnosisYear: numberOrUndefined('diagnosisYear'), treatment: data.get('treatment'),
          bpSystolic: numberOrUndefined('bpSystolic'), bpDiastolic: numberOrUndefined('bpDiastolic'),
          conditions: data.getAll('conditions'),
          timeCommitment: data.get('timeCommitment'), availability: data.get('availability'), motivation: data.get('motivation'),
          emergencyName: data.get('emergencyName'), emergencyPhone: data.get('emergencyPhone'), emergencyRelationship: data.get('emergencyRelationship'),
          medicalReportFileIds: selectedFiles.map(file => file.__uploadedId).filter(Boolean),
          medicalReportFileNames: selectedFiles.map(file => file.name),
          consentAccuracy: data.get('accuracy') === 'on', consentSelection: data.get('selection') === 'on',
          consentExpeditionContact: data.get('expeditionContact') === 'on', consentDpdp: data.get('dpdpConsent') === 'on',
          consentFutureContact: data.get('futureContact') === 'on',
        };

        await submitForm('applications', values, { honeypot: data.get('companyWebsite'), rowId: applicationId });

        // Best-effort, session-scoped edit history: only meaningful once
        // there's a prior snapshot from earlier in the same visit, since the
        // client can't read its own previously-submitted row back (table
        // reads are admin-team-only by design).
        if (lastSubmittedSnapshot) {
          const changedFields = Object.keys(values).filter(key => JSON.stringify(values[key]) !== JSON.stringify(lastSubmittedSnapshot[key]));
          if (changedFields.length || uploadedIds.length) {
            submitForm('applicationHistory', {
              applicationId,
              changedAt: new Date().toISOString(),
              changeSource: 'participant_edit',
              changedFields,
              previousValues: JSON.stringify(lastSubmittedSnapshot),
              newValues: JSON.stringify(values),
              filesAdded: uploadedIds,
              filesRemoved: [],
            }).catch(() => {});
          }
        }
        lastSubmittedSnapshot = values;

        // Only reached on a confirmed successful write. The button stays
        // disabled from here on (it is only re-enabled in the catch below),
        // so a second click, a double-tap or an accidental Enter cannot
        // submit again. Re-entering via "Edit Application" re-enables it
        // explicitly, and because the row id is fixed per session that path
        // updates the same record rather than creating a second one.
        submitted = true;
        if (reviewScreen) reviewScreen.hidden = true;
        form.hidden = true;
        confirmation.hidden = false;
        if (referenceEl) {
          referenceEl.textContent = `Reference: ${applicationId}`;
          referenceEl.hidden = false;
        }
        // Files are the only sensitive thing held in memory after success;
        // the application id is deliberately kept so support can look the
        // submission up and so an edit updates the same row.
        selectedFiles = [];
        renderFileList();
        errors.textContent = '';
        // Focus the heading rather than the container so screen readers
        // announce the success message itself.
        (confirmation.querySelector('#form-confirmation-title') || confirmation).focus();
      } catch (err) {
        const message = err?.message || '';
        // The applications table carries unique indexes on the normalised
        // email and phone, so a second application from the same person is
        // rejected by the database rather than by the browser. Map that
        // conflict onto the field it came from instead of surfacing a raw
        // backend error.
        if (isDuplicateError(err)) {
          const dupEmail = /email/i.test(message);
          const dupPhone = /phone/i.test(message);
          if (dupPhone && !dupEmail) {
            errors.textContent = 'This phone number is already linked to an application.';
          } else if (dupEmail && !dupPhone) {
            errors.textContent = 'This email address is already linked to an application.';
          } else {
            errors.textContent = 'This email address is already linked to an application.';
          }
        } else {
          errors.textContent = message || 'Something went wrong submitting this form. Please try again in a moment.';
        }
        errors.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        submitReviewButton.disabled = false;
        submitReviewButton.textContent = originalLabel;
      }
    });

    confirmation?.querySelector('[data-edit-application]')?.addEventListener('click', () => {
      // Editing an already-submitted application re-arms the submit button.
      // The row id is unchanged, so this updates the same record and is not
      // reported as a duplicate of itself.
      submitted = false;
      if (submitReviewButton) submitReviewButton.disabled = false;
      confirmation.hidden = true; form.hidden = false; showStep(steps.length);
    });
    showStep(1, false);
  }

  document.querySelectorAll('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq-list details[open]').forEach(other => { if (other !== detail) other.open = false; });
  }));
  document.querySelectorAll('.purpose-reading details').forEach(detail => {
    detail.open = false;
    detail.addEventListener('toggle', () => {
      if (detail.open) document.querySelectorAll('.purpose-reading details[open]').forEach(other => { if (other !== detail) other.open = false; });
    });
  });

  const countdowns = [...document.querySelectorAll('[data-countdown-days]')];
  if (countdowns.length) {
    const goalDate = new Date('2026-11-14T00:00:00+05:30');
    const daysRemaining = Math.max(0, Math.ceil((goalDate - new Date()) / 86400000));
    countdowns.forEach(countdown => { countdown.textContent = daysRemaining; });
  }

  const applicationDrawer = document.querySelector('.application-drawer');
  document.querySelectorAll('a[href="#register"]').forEach(link => link.addEventListener('click', () => {
    if (applicationDrawer) applicationDrawer.open = true;
  }));
  if (location.hash === '#register' && applicationDrawer) applicationDrawer.open = true;

  const floatingLinks = [...document.querySelectorAll('.floating-nav a[href^="#"]')];
  const floatingNav = document.querySelector('.floating-nav');
  let floatingNavIdleTimer = 0;
  const floatingNavIdleDelay = 3000;

  const setFloatingNavExpanded = expanded => {
    if (!floatingNav) return;
    floatingNav.classList.toggle('is-idle', !expanded);
    floatingNav.classList.toggle('is-expanded', expanded);
    floatingNav.setAttribute('data-nav-state', expanded ? 'expanded' : 'idle');
  };

  const scheduleFloatingNavIdle = () => {
    if (!floatingNav) return;
    clearTimeout(floatingNavIdleTimer);
    floatingNavIdleTimer = window.setTimeout(() => {
      const pointerIsInside = finePointer && floatingNav.matches(':hover');
      const keyboardIsInside = floatingNav.contains(document.activeElement);
      if (pointerIsInside || keyboardIsInside) {
        scheduleFloatingNavIdle();
        return;
      }
      setFloatingNavExpanded(false);
    }, floatingNavIdleDelay);
  };

  const wakeFloatingNav = () => {
    setFloatingNavExpanded(true);
    scheduleFloatingNavIdle();
  };

  if (floatingNav) {
    floatingNav.classList.add('is-expanded');
    floatingNav.setAttribute('data-nav-state', 'expanded');

    if (finePointer) {
      floatingNav.addEventListener('pointerenter', wakeFloatingNav);
      floatingNav.addEventListener('pointerleave', scheduleFloatingNavIdle);
    } else {
      floatingNav.addEventListener('pointerdown', event => {
        if (!floatingNav.classList.contains('is-idle')) {
          scheduleFloatingNavIdle();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        wakeFloatingNav();
      }, { passive: false });
    }

    floatingNav.addEventListener('focusin', wakeFloatingNav);
    floatingNav.addEventListener('focusout', () => requestAnimationFrame(scheduleFloatingNavIdle));
    floatingNav.addEventListener('click', scheduleFloatingNavIdle);
    scheduleFloatingNavIdle();
  }

  const navTargets = floatingLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  floatingLinks.forEach(link => link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    history.pushState(null, '', href);
    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
      updateFloatingNav();
    });
  }));
  updateFloatingNav = () => {
    if (!navTargets.length) return;
    const focusLine = innerHeight * .42;
    const orderedTargets = [...navTargets].sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    let activeTarget = orderedTargets[0];
    orderedTargets.forEach(target => {
      if (target.getBoundingClientRect().top <= focusLine) activeTarget = target;
    });
    floatingLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${activeTarget.id}`));
  };
  addEventListener('scroll', updateFloatingNav, { passive: true });
  addEventListener('resize', updateFloatingNav, { passive: true });
  updateFloatingNav();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(measureFrameId);
      frameId = 0;
      measureFrameId = 0;
      ambientAudio?.pause();
    } else {
      lastFrameTime = performance.now();
      scheduleMeasure();
      if (natureOn) { if (audible) ambientAudio?.play().catch(() => {}); else primeNature(); }
    }
  });
  measure(); requestRender();
})();
