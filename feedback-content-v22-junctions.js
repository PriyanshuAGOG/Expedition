(() => {
  'use strict';

  if (document.body.classList.contains('application-page')) return;

  const BORDER_ASSETS = [
    { src: 'assets/borders/png/forest-junction-01.png', width: 256, height: 84, heightDesktop: '7rem' },
    { src: 'assets/borders/png/forest-junction-02.png', width: 256, height: 144, heightDesktop: '8.25rem' },
    { src: 'assets/borders/png/forest-junction-03.png', width: 256, height: 132, heightDesktop: '8rem' },
    { src: 'assets/borders/png/forest-junction-04.png', width: 256, height: 121, heightDesktop: '7.75rem' },
    { src: 'assets/borders/png/forest-junction-05.png', width: 256, height: 108, heightDesktop: '7.25rem' }
  ];

  const sectionLabel = section =>
    section?.id ||
    section?.getAttribute('aria-label') ||
    section?.className?.split(/\s+/)[0] ||
    'section';

  const nodesBetween = (from, to) => {
    const nodes = [];
    let node = from?.nextElementSibling;
    while (node && node !== to) {
      nodes.push(node);
      node = node.nextElementSibling;
    }
    return nodes;
  };

  const eligibleNativeChildren = section =>
    [...(section?.children || [])].filter(
      child =>
        !child.classList?.contains('experience-v22-decor') &&
        !child.classList?.contains('experience-v22-junction')
    );

  const hasDirectionalNativeEdge = (section, edge) => {
    const children = eligibleNativeChildren(section);
    if (!children.length) return false;

    const directedClass =
      edge === 'top'
        ? /(?:^|[-_\s])(?:seam|join|boundary)[-_]?top(?:$|[-_\s])|(?:^|[-_\s])top[-_]?(?:seam|join|boundary)(?:$|[-_\s])/i
        : /(?:^|[-_\s])(?:seam|join|boundary)[-_]?bottom(?:$|[-_\s])|(?:^|[-_\s])bottom[-_]?(?:seam|join|boundary)(?:$|[-_\s])/i;

    const genericBoundary = /(?:section|terrain|canopy|groundcover|leafy).*(?:seam|join|boundary)|(?:seam|join|boundary).*(?:section|terrain|canopy|groundcover|leafy)/i;
    const edgeSpan = Math.min(3, children.length);

    return children.some((child, index) => {
      const className = typeof child.className === 'string' ? child.className : '';
      const position = child.getAttribute?.('data-boundary-position');

      if (position === edge) return true;
      if (directedClass.test(className)) return true;

      const isNearRequestedEdge =
        edge === 'top' ? index < edgeSpan : index >= children.length - edgeSpan;

      if (!isNearRequestedEdge) return false;

      return (
        child.matches?.('[data-native-section-join], .section-transition, .section-seam') ||
        genericBoundary.test(className)
      );
    });
  };

  const hasNativeBoundary = (from, to) => {
    if (!from || !to || from.id === 'top') return false;

    const interstitialJoin = nodesBetween(from, to).some(node =>
      node.matches?.(
        '.leafy-join, [data-native-section-join], .section-transition, .section-boundary, .terrain-join, .canopy-join'
      )
    );

    return (
      interstitialJoin ||
      hasDirectionalNativeEdge(from, 'bottom') ||
      hasDirectionalNativeEdge(to, 'top')
    );
  };

  const createJunction = (from, to, assetIndex) => {
    const asset = BORDER_ASSETS[assetIndex];
    const junction = document.createElement('div');
    const isHeroBoundary = from?.id === 'top';

    junction.className = 'experience-v22-junction experience-v22-png-junction';
    if (isHeroBoundary) junction.classList.add('experience-v22-png-junction-hero');

    junction.dataset.junctionVariant = String(assetIndex + 1);
    junction.dataset.junctionFrom = sectionLabel(from);
    junction.dataset.junctionTo = sectionLabel(to);
    junction.style.setProperty('--junction-height-desktop', asset.heightDesktop);
    junction.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.src = asset.src;
    image.alt = '';
    image.width = asset.width;
    image.height = asset.height;
    image.loading = isHeroBoundary ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (isHeroBoundary) image.fetchPriority = 'high';
    image.addEventListener(
      'error',
      () => {
        image.hidden = true;
        image.dataset.junctionAssetFailed = 'true';
      },
      { once: true }
    );

    junction.appendChild(image);
    return junction;
  };

  const auditJunctions = boundaryReport => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const junctions = [...document.querySelectorAll('main > .experience-v22-png-junction')];
        const variants = junctions.map(node => Number(node.dataset.junctionVariant));
        const consecutiveRepeats = variants.filter(
          (variant, index) => index > 0 && variant === variants[index - 1]
        );
        const failedAssets = junctions.reduce(
          (total, node) =>
            total + node.querySelectorAll('[data-junction-asset-failed="true"]').length,
          0
        );
        const horizontalOverflow =
          document.documentElement.scrollWidth > window.innerWidth + 2;

        window.__EXPEDITION_JUNCTION_AUDIT__ = {
          generatedAt: new Date().toISOString(),
          addedCount: junctions.length,
          preservedNativeCount: boundaryReport.filter(
            item => item.action === 'preserved-native'
          ).length,
          variants,
          consecutiveRepeats,
          failedAssets,
          horizontalOverflow,
          boundaries: boundaryReport
        };

        document.documentElement.dataset.junctionAudit =
          !consecutiveRepeats.length && !failedAssets && !horizontalOverflow
            ? 'pass'
            : 'review';
      })
    );
  };

  const buildJunctions = () => {
    const main = document.querySelector('main');
    if (!main) return;

    main
      .querySelectorAll(':scope > .experience-v22-junction')
      .forEach(node => node.remove());

    const sections = [...main.querySelectorAll(':scope > section')];
    if (sections.length < 2) return;

    const boundaryReport = [];
    let addedIndex = 0;

    sections.slice(1).forEach((section, sectionIndex) => {
      const previousSection = sections[sectionIndex];
      const nativeBoundary = hasNativeBoundary(previousSection, section);
      const forceHeroBoundary = previousSection.id === 'top';

      if (!forceHeroBoundary && nativeBoundary) {
        boundaryReport.push({
          from: sectionLabel(previousSection),
          to: sectionLabel(section),
          action: 'preserved-native'
        });
        return;
      }

      const assetIndex = addedIndex % BORDER_ASSETS.length;
      const junction = createJunction(previousSection, section, assetIndex);
      main.insertBefore(junction, section);

      boundaryReport.push({
        from: sectionLabel(previousSection),
        to: sectionLabel(section),
        action: 'added-png',
        variant: assetIndex + 1,
        asset: BORDER_ASSETS[assetIndex].src
      });

      addedIndex += 1;
    });

    document.documentElement.classList.remove('experience-v22-junctions-ready');
    document.documentElement.classList.add('experience-v22-png-junctions-ready');
    auditJunctions(boundaryReport);
  };

  const run = () => {
    buildJunctions();

    let resizeTimer = 0;
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const report = window.__EXPEDITION_JUNCTION_AUDIT__?.boundaries || [];
          auditJunctions(report);
        }, 180);
      },
      { passive: true }
    );
  };

  const schedule = () => requestAnimationFrame(() => requestAnimationFrame(run));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
