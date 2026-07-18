(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.parallax-hero');
  const progressNumber = document.querySelector('.progress-number');
  const depthSections = [...document.querySelectorAll('[data-depth-section]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoothstep = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

  let targetProgress = 0, currentProgress = 0;
  let targetMouseX = 0, targetMouseY = 0, mouseX = 0, mouseY = 0;
  let frameId = 0;

  const measure = () => {
    if (hero) {
      const rect = hero.getBoundingClientRect();
      targetProgress = clamp(-rect.top / Math.max(1, hero.offsetHeight - innerHeight));
    }
    const documentDistance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    root.style.setProperty('--page-progress', clamp(scrollY / documentDistance).toFixed(5));
    depthSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const p = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      section.style.setProperty('--section-y', (p * 2 - 1).toFixed(4));
      section.style.setProperty('--section-shift-bg', `${((p * 2 - 1) * -2.5).toFixed(4)}svh`);
      section.style.setProperty('--section-shift-frame', `${((p * 2 - 1) * 1.6).toFixed(4)}svh`);
      section.style.setProperty('--section-shift-seam', `${((p * 2 - 1) * .7).toFixed(4)}svh`);
    });
  };

  const render = () => {
    const phone = innerWidth <= 680;
    currentProgress += (targetProgress - currentProgress) * (reducedMotion ? 1 : phone ? .19 : .16);
    mouseX += (targetMouseX - mouseX) * (reducedMotion ? 1 : .045);
    mouseY += (targetMouseY - mouseY) * (reducedMotion ? 1 : .045);
    const descent = clamp(currentProgress / .76);
    const exit = smoothstep(phone ? .88 : .79, 1, currentProgress);
    root.style.setProperty('--p', currentProgress.toFixed(5));
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
    root.style.setProperty('--title-back-x', vw(mouseX * .12)); root.style.setProperty('--title-back-y', svh(descent * (phone ? 48 : 52) + mouseY * .1));
    root.style.setProperty('--title-middle-x', vw(mouseX * .18)); root.style.setProperty('--title-middle-y', svh(descent * (phone ? 56 : 61) + mouseY * .14));
    root.style.setProperty('--title-front-x', vw(mouseX * .24)); root.style.setProperty('--title-front-y', svh(descent * (phone ? 64 : 69) + mouseY * .2));
    root.style.setProperty('--rays-o', Math.max(0, .3 - exit * .22).toFixed(4)); root.style.setProperty('--rays-x', vw(descent * -1)); root.style.setProperty('--rays-y', svh(descent));
    root.style.setProperty('--chrome-o', Math.max(0, 1 - exit * .92).toFixed(4)); root.style.setProperty('--scroll-o', Math.max(0, 1 - descent * 1.55).toFixed(4));
    if (progressNumber) progressNumber.textContent = String(Math.round(currentProgress * 100)).padStart(2, '0');
    frameId = requestAnimationFrame(render);
  };

  if (finePointer) {
    addEventListener('pointermove', event => {
      targetMouseX = clamp((event.clientX / innerWidth - .5) * 2, -1, 1);
      targetMouseY = clamp((event.clientY / innerHeight - .5) * 2, -1, 1);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { targetMouseX = 0; targetMouseY = 0; });
  }
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure, { passive: true });

  const revealElements = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) revealElements.forEach(el => el.classList.add('visible'));
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible'); observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -7% 0px', threshold: .07 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  const routeMoments = [...document.querySelectorAll('.route-moment')];
  if (routeMoments.length && 'IntersectionObserver' in window) {
    const routeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('route-active');
    }), { rootMargin: '-38% 0px -38% 0px', threshold: .1 });
    routeMoments.forEach(moment => routeObserver.observe(moment));
  }

  /* Authentic field-recorded ambience: request immediately, then retry on the first allowed gesture. */
  const ambientAudio = document.querySelector('#nature-audio');
  const ambientControl = document.querySelector('.ambient-control');
  const ambientLabel = ambientControl?.querySelector('[data-ambient-label]');
  let natureStarting = false, natureOn = true;
  const setAmbientUI = (playing, label = playing ? 'Sound on' : 'Sound ready') => {
    ambientControl?.setAttribute('aria-pressed', String(playing));
    ambientControl?.setAttribute('aria-label', playing ? 'Mute nature ambience' : 'Play nature ambience');
    if (ambientLabel) ambientLabel.textContent = label;
  };
  const activationEvents = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
  const removeNatureActivation = () => activationEvents.forEach(type => window.removeEventListener(type, startNature));
  async function startNature() {
    if (natureStarting || !natureOn) return;
    if (ambientAudio && !ambientAudio.paused) { setAmbientUI(true); removeNatureActivation(); return; }
    natureStarting = true;
    if (ambientAudio) {
      try {
        ambientAudio.volume = .55;
        ambientAudio.muted = false;
        await ambientAudio.play();
        setAmbientUI(true);
        removeNatureActivation();
      } catch (_) {
        setAmbientUI(false);
      } finally {
        natureStarting = false;
      }
      return;
    }
    natureStarting = false;
  }
  activationEvents.forEach(type => window.addEventListener(type, startNature, { passive: true }));
  ambientControl?.addEventListener('click', () => {
    if (natureOn && ambientAudio && !ambientAudio.paused) {
      natureOn = false; ambientAudio.pause(); setAmbientUI(false, 'Sound off');
    } else {
      natureOn = true; startNature();
    }
  });
  startNature();

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
    form.addEventListener('submit', event => { event.preventDefault(); if (!validateCurrentStep()) return; form.hidden = true; confirmation.hidden = false; confirmation.focus(); });
    confirmation?.querySelector('[data-edit-application]')?.addEventListener('click', () => { confirmation.hidden = true; form.hidden = false; showStep(3); });
    showStep(1, false);
  }

  document.querySelectorAll('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq-list details[open]').forEach(other => { if (other !== detail) other.open = false; });
  }));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      ambientAudio?.pause();
      audioContext?.suspend();
    } else {
      frameId = requestAnimationFrame(render);
      if (natureOn) startNature();
    }
  });
  measure(); render();
})();
