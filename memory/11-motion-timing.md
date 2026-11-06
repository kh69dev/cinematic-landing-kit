# 11 · Motion Vocabulary & Timing

A consistent, small motion vocabulary is what makes the page feel directed rather than decorated.

## Easing vocabulary (pick ~3, reuse everywhere)
- `power2.out` / `power3.out`: soft reveals and the hero entrance.
- `expo.inOut`: big moves (section wipes, page transitions).
- `none`: anything scrubbed by scroll. The scroll is already the easing.

## Timing cheat sheet
| Element | Duration | Ease |
|---|---|---|
| Button hover | 0.2–0.3 s | power2.out |
| Text / line reveal | 0.9–1.2 s, stagger 0.08 | expo.out / power3.out |
| Card reveal | 0.8–1 s, stagger 0.06 | power2.out |
| Hero entrance | ~1.5 s (max 2.5 s) | power3.out |
| Ambient color tween | ~1.1 s | default |
| Page / section wipe | 0.6–0.9 s | expo.inOut |
| Scrubbed film / CTA gate | scroll-defined | none (`scrub: true` for the film, `scrub: 1` for cinematic weight elsewhere) |

## Patterns worth reusing
- **Reveal on enter:** `gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } })`. Use `once: true`: content that disappears when scrolling back up feels broken. `ScrollTrigger.batch` staggers groups.
- **Headline mask reveal:** split lines after `document.fonts.ready` (GSAP SplitText with `mask: "lines"`, free since GSAP 3.13), then `yPercent: 110 → 0`, stagger 0.09. Splitting before fonts load breaks line wrapping. Keep SplitText's `aria-label` so screen readers get the full text.
- **Counters** for proof numbers: tween an object from 0 to the value and write `Math.round(v).toLocaleString("ar-EG")` (or the page locale) on update, `once: true`.
- **Logo marquee:** duplicate the row and animate `xPercent: -50`, `repeat: -1`, `ease: "none"`; pause on hover.
- **Section anchors:** `lenis.scrollTo(target, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) })`.
- **Multi-page:** the View Transitions API (`@view-transition { navigation: auto; }` plus `view-transition-name` on shared elements); kill old ScrollTriggers on SPA route changes.

## DOM rules
- Animate only `transform` and `opacity`. Never animate `width`, `top`, `margin` or other layout properties on scroll.
- Call `ScrollTrigger.refresh()` after fonts, the first film frames and hero images load, and test resizing.
- One shared clock: Lenis runs on GSAP's ticker (see [01](01-build-playbook.md)); never start a second rAF loop.
