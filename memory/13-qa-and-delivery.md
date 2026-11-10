# 13 · QA Checklist & Deliverables

Run this before calling the page done. Pair it with the auto-rejects in [09](09-quality-bar.md).

## Checklist
**Story and brand**
- [ ] Every storyboard act ([10](10-brief-and-storyboard.md)) is present and the film lands as the signature moment.
- [ ] Brand palette, fonts and logo rules followed; product identity identical in every asset; modesty respected.
- [ ] Copy is real and final; price and how-to-order are plain text.

**Motion**
- [ ] No jitter while scrolling the film (canvas sequence, one rAF clock).
- [ ] Pins release cleanly; resizing doesn't break positions.
- [ ] Reveals don't re-hide content on scroll-up.
- [ ] Reduced-motion version reviewed with DevTools emulation.

**Devices**
- [ ] Chrome, Safari and Firefox desktop; iOS Safari; Android Chrome.
- [ ] Widths 1440, 1024, 768 and 390; no horizontal page scroll.
- [ ] Slow 4G: preloader caps, hero shows first, film catches up.
- [ ] Assets renamed or missing: fallback gradients appear, never broken boxes.

**Quality**
- [ ] Lighthouse mobile: Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Keyboard-only pass.
- [ ] `<title>`, meta description, `og:title`, `og:description`, `og:image` (the hero shot) and a favicon from the emblem.
- [ ] Console free of errors and warnings.

## Automated screenshots (Playwright)
A Playwright-launched browser is visible to the renderer, so unlike the hidden preview tab ([08](08-preview-and-env-gotchas.md)) animations and preloading run. `scripts/shots.mjs`:

```bash
npm i -D playwright && npx playwright install chromium
npx -y serve -l 8123 . &   # then:
node scripts/shots.mjs http://localhost:8123
```

It saves hero and full-page screenshots at 1440, 1024 and 390 into `qa/`, plus a mid-film shot, and reports page errors and horizontal overflow. Look at every screenshot: scripts catch overflow and errors, only eyes catch "this doesn't feel premium yet".

For a deeper audit (scores, weight, SEO, accessibility, before/after), run `node scripts/analyze-site.cjs . --out audit/before` (see [14](14-other-modes.md)).

## Deliverables
1. The storyboard table and the filled prompt list.
2. The single `index.html` with palette tokens in one `:root` block.
3. `assets/`: optimized stills, the cutout, the frame sequence and the CTA clips.
4. A short README: how to run it, where to change copy, colors and prices, how to regenerate or swap assets, and `FRAME_COUNT`.
5. QA results: Lighthouse scores and the screenshots at three widths.
