(() => {
  'use strict';

  const SCENES = [
    {
      src: 'assets/experience/webp/13-waterfall-ravine.webp',
      alt: 'A misty green Himalayan ravine and waterfall',
      label: 'Possibility'
    },
    {
      src: 'assets/sections/webp/12-research-archive.webp',
      alt: 'Field notes and expedition documentation in a mountain setting',
      label: 'Influence'
    },
    {
      src: 'assets/sections/webp/09-preparation.webp',
      alt: 'Participants preparing together in a green mountain clearing',
      label: 'Metabolic health'
    },
    {
      src: 'assets/sections/webp/11-expedition-team.webp',
      alt: 'A group moving together through a Himalayan valley',
      label: 'Community'
    },
    {
      src: 'assets/experience/webp/15-evening-camp.webp',
      alt: 'A quiet expedition camp surrounded by mountain forest',
      label: 'Memories'
    }
  ];

  const enhanceGainsSection = () => {
    if (document.body.classList.contains('application-page')) return;

    const section = document.querySelector('#expedition-gains');
    if (!section || section.classList.contains('gain-world-v7')) return;

    section.classList.add('gain-world-v7');

    const heading = section.querySelector('.gain-heading');
    if (heading && !heading.querySelector('.gain-intro')) {
      const intro = document.createElement('p');
      intro.className = 'gain-intro';
      intro.textContent = 'Five ways the journey can keep moving forward long after the trail ends.';
      heading.appendChild(intro);
    }

    const grid = section.querySelector('.gain-grid');
    const cards = [...section.querySelectorAll('.gain-card')];
    if (!grid || !cards.length) return;

    grid.setAttribute('role', 'list');

    cards.forEach((card, index) => {
      const scene = SCENES[index];
      if (!scene) return;

      card.setAttribute('role', 'listitem');
      card.classList.add('gain-story-card');

      const number = card.querySelector('.gain-number');
      const copy = card.querySelector('.gain-card-copy');
      if (!number || !copy) return;

      const figure = document.createElement('figure');
      figure.className = 'gain-scene';
      figure.innerHTML = `
        <img src="${scene.src}" alt="${scene.alt}" loading="lazy" decoding="async">
        <figcaption>${scene.label}</figcaption>
        <span class="gain-scene-line" aria-hidden="true"></span>`;

      const arrow = document.createElement('span');
      arrow.className = 'gain-card-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';

      copy.appendChild(arrow);
      card.replaceChildren(figure, number, copy);
      card.classList.add('is-visible');
    });

    const flora = section.querySelector('.gain-flora');
    flora?.setAttribute('aria-hidden', 'true');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceGainsSection, { once: true });
  } else {
    enhanceGainsSection();
  }
})();
