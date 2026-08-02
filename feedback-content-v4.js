(() => {
  'use strict';

  const run = () => {
    document.querySelector('.nomination-form')?.classList.add('visible');

    const registrationTime = [...document.querySelectorAll('.registration-meta > div')]
      .find(item => /^time$/i.test(item.querySelector('span')?.textContent || ''));
    const value = registrationTime?.querySelector('strong');
    if (value) value.textContent = '5 mins';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
