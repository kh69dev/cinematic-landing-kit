# 12 · Performance, Accessibility & Mobile

A cinematic page that stutters or excludes people feels cheap. These are part of the quality bar, not extras.

## Budgets
| Metric | Target |
|---|---|
| LCP | < 2.5 s on 4G (the hero cutout or poster is the LCP: preload it) |
| CLS | < 0.1 (reserve sizes for canvas, images and fonts) |
| INP | < 200 ms |
| JS (gzipped) | < 300 KB |
| Film frames | ~5–8 MB total, ~60–90 KB per frame |
| Frame rate | 60 fps desktop, ≥ 30 fps mid-range phone |

## Techniques
- `<link rel="preload" as="image" href="assets/product-cut.png" fetchpriority="high">` for the hero.
- Film: load the first ~20 frames eagerly, the rest after first paint; on phones use every second frame at ~960 px wide.
- Cap the canvas DPR at 2 (1.5 on phones); skip redundant draws; stop continuous loops (aura, motes) when the hero is offscreen (IntersectionObserver) or the tab is hidden (`visibilitychange`).
- Videos: H.264 MP4 (+ WebM), `preload="none"` until the CTA is near, a poster frame, muted `playsinline`.
- Fonts: request only the weights you use, `display=swap`; self-host as subset WOFF2 for production.
- Web-optimize generated stills (see [06](06-higgsfield-pipeline.md)) or run `scripts/optimize-assets.cjs` on the finished folder.

## Accessibility
- The DOM is the content: real headings, paragraphs, links and the price as text. The canvas is decoration (`aria-hidden="true"`) or `role="img"` with an `aria-label` when it carries meaning; every `<img>` has a real `alt`.
- `prefers-reduced-motion: reduce`: no Lenis inertia, no pins or scrubs, no hero loops; show the final states and one representative film frame.
- Contrast: body text ≥ 4.5:1. Deep gold on ivory passes; pale champagne on ivory does not.
- Keyboard: Tab through the whole page with Lenis active; focus states stay visible; focused elements scroll into view.
- Don't trap scroll: every pin ends, and the page scrolls by keyboard, touch and scrollbar.
- RTL: `dir="rtl"`, logical properties (`margin-inline-start`), and never mirror logos or product imagery.

## Mobile
- Same story, fewer effects: shorter pins (~60% of desktop length), lighter film, no pointer tilt (fine pointers only).
- `ScrollTrigger.config({ ignoreMobileResize: true })` so the collapsing address bar doesn't trigger refreshes.
- `svh` / `dvh` for full-height stages instead of `vh`.
- Test touch scrolling on a real phone; anything draggable needs `touch-action: pan-y`.
