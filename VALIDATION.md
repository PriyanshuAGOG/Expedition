# Validation Summary

- Desktop green-layer alpha coverage: **52.8%** at 1440 × 900.
- Mobile green-layer alpha coverage: **41.5%** at 390 × 844 using dedicated portrait assets.
- Runtime WebP imagery: approximately **4.99 MB**, including dedicated hero layers, section seams, the generated relief map and field compass, five full-size Himalayan threshold markers, and 24 alpha-transparent botanical micro-assets (approximately **996 KB** combined).
- Atmospheric system: three generated photographic cloud/fog plates, screen-composited across separate hero depth planes and reused in the field-arrival sequence.
- Nature ambience: the supplied uninterrupted five-minute forest recording, included unchanged.
- Nature ambience MP3: approximately **9.67 MB**.
- Self-contained V6 HTML: approximately **25.71 MB**, with every runtime image, stylesheet, script and audio asset embedded for offline use.
- JavaScript syntax: passed `node --check`.
- HTML parser: passed.
- CSS braces: balanced.
- Duplicate IDs: none.
- Missing anchor targets: none.
- Missing local assets: none.
- Images without alt attributes: none.
- Required registration fields: 20 across three steps.
- Reduced-motion mode: included.
- Dedicated mobile scroll choreography: rendered at four representative depths.
- Expedition briefing and selection journey are visually distinct: an overhead documentary atlas and field dossier versus a horizontal full-screen threshold passage with five large physical waymarkers; phones use a compact vertical switchback.
- All 24 generated botanical assets are referenced by explicit foreground `<img>` layers with non-zero dimensions. Contact-sheet review confirmed clean transparent silhouettes with no visible chroma-key rectangles; mobile CSS reduces size, density and opacity to protect reading order.
- Nature audio: continuous supplied recording; immediate playback is requested, with first-interaction retry where autoplay is restricted.
- Public archive: intentionally hidden pre-expedition; source structure remains ready for post-expedition activation.
- Below-fold images: lazy-loaded.
- Sensitive health data storage: deliberately disabled in the prototype.

Automated Chromium QA passed at **1440 × 900** and **390 × 844**. The complete page loaded without console errors, horizontal overflow or missing imagery. Targeted screenshots verified the expedition atlas, all threshold states and the mobile one-note-at-a-time atlas behavior.
