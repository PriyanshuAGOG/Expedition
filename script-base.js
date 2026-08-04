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
  let natureOn = false, audible = false, audioCtx, audioGraphReady = false;
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
  setAmbientUI(false, 'Sound off');

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
    const motivation = form.querySelector('textarea[name="motivation"]'), counter = form.querySelector('[data-count]');
    let currentStep = 1;
    const showStep = (step, moveFocus = true) => {
      currentStep = clamp(step, 1, steps.length);
      steps.forEach(panel => { const active = +panel.dataset.formStep === currentStep; panel.hidden = !active; panel.classList.toggle('active', active); });
      indicators.forEach(indicator => indicator.classList.toggle('active', +indicator.dataset.stepIndicator <= currentStep));
      backButton.hidden = currentStep === 1; nextButton.hidden = currentStep === steps.length; submitButton.hidden = currentStep !== steps.length; errors.textContent = '';
      if (moveFocus) form.querySelector(`[data-form-step="${currentStep}"] legend`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    };
    const validateCurrentStep = () => {
      const fields = [...form.querySelector(`[data-form-step="${currentStep}"]`).querySelectorAll('[required]')]; let firstInvalid, invalidCount = 0;
      fields.forEach(field => { const valid = field.checkValidity(); field.closest('.field')?.classList.toggle('invalid', !valid); if (!valid) { invalidCount += 1; firstInvalid ||= field; } });
      if (!invalidCount) { errors.textContent = ''; return true; }
      errors.textContent = `Please complete ${invalidCount} required ${invalidCount === 1 ? 'field' : 'fields'} before continuing.`;
      firstInvalid?.focus({ preventScroll: true }); firstInvalid?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }); return false;
    };
    nextButton.addEventListener('click', () => { if (validateCurrentStep()) showStep(currentStep + 1); });
    backButton.addEventListener('click', () => showStep(currentStep - 1));
    form.addEventListener('input', event => { event.target.closest('.field')?.classList.remove('invalid'); if (event.target === motivation && counter) counter.textContent = motivation.value.length; });
    const none = form.querySelector('input[name="conditions"][value="none"]'), conditions = [...form.querySelectorAll('input[name="conditions"]')];
    conditions.forEach(input => input.addEventListener('change', () => { if (input === none && input.checked) conditions.filter(item => item !== none).forEach(item => item.checked = false); else if (input.checked && none) none.checked = false; }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateCurrentStep()) return;
      if (submitButton.disabled) return;
      submitButton.disabled = true;
      const originalLabel = submitButton.innerHTML;
      submitButton.innerHTML = 'Submitting…';
      errors.textContent = '';
      import('./assets/js/appwrite-client.js').then(({ submitForm }) => {
        const data = new FormData(form);
        const numberOrUndefined = name => { const value = data.get(name); return value === null || value === '' ? undefined : Number(value); };
        return submitForm('applications', {
          fullName: data.get('fullName'), email: data.get('email'), phone: data.get('phone'),
          age: numberOrUndefined('age'), city: data.get('city'), state: data.get('state'), country: data.get('country'),
          diagnosisYear: numberOrUndefined('diagnosisYear'), treatment: data.get('treatment'), hba1c: numberOrUndefined('hba1c'),
          conditions: data.getAll('conditions'),
          timeCommitment: data.get('timeCommitment'), availability: data.get('availability'), motivation: data.get('motivation'),
          emergencyName: data.get('emergencyName'), emergencyPhone: data.get('emergencyPhone'), emergencyRelationship: data.get('emergencyRelationship'),
          consentAccuracy: data.get('accuracy') === 'on', consentSelection: data.get('selection') === 'on',
          consentExpeditionContact: data.get('expeditionContact') === 'on', consentDpdp: data.get('dpdpConsent') === 'on',
          consentFutureContact: data.get('futureContact') === 'on',
        }, { honeypot: data.get('companyWebsite') });
      }).then(() => {
        form.hidden = true; confirmation.hidden = false; confirmation.focus();
      }).catch(err => {
        errors.textContent = err?.message || 'Something went wrong submitting this form. Please try again in a moment.';
        errors.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      }).finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      });
    });
    confirmation?.querySelector('[data-edit-application]')?.addEventListener('click', () => { confirmation.hidden = true; form.hidden = false; showStep(3); });
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
