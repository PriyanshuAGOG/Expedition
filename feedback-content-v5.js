(() => {
  'use strict';

  // The hero information strip this file used to rewrite was removed from the
  // hero (second pass); nothing else in v5 touched the page.
  const run = () => {};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
