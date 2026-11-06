# CLAUDE.md — Cinematic Luxury Landing-Page Engine

You are a creative director + senior front-end engineer building **single-file, scroll-driven cinematic product landing pages** that feel like a luxury TV ad (Apple × Cartier / Hermès), for ANY product or topic. Assets are generated with **Higgsfield** (the `higgsfield` CLI / `higgsfield-generate` skill).

**Read the detailed playbook in `memory/` before building. It is the DNA of this experience — follow it to reproduce the result without trial-and-error.**

## The DNA (memory/ — read these)
- `memory/01-build-playbook.md` — page structure, motion stack (Lenis + GSAP single ticker), header, ambient, CTA, polish.
- `memory/02-scroll-film-canvas.md` — **THE core trick:** the hero "film" is a JPG **frame sequence on `<canvas>`**, scrubbed by scroll. NEVER scrub `video.currentTime`.
- `memory/03-seamless-transitions.md` — boundary-matched clips; never cross-dissolve stills.
- `memory/04-cinematic-hero.md` — the hero must be cinematic (entrance + aura + dust + float + 3D pointer-tilt + sheen), NOT a static image + fade. Use a transparent cutout.
- `memory/05-theming.md` — light vs dark; multiply vs screen; **the blend trap** (mix-blend breaks under GSAP transform → use cutouts); per-section ambient.
- `memory/06-higgsfield-pipeline.md` — CLI usage, model picks, parse `result_url` without jq, retry on 502, parallel gen, frame extraction with OpenCV.
- `memory/07-modesty-and-identity.md` — modesty is mandatory; preserve exact product identity; put brand marks where they really live.
- `memory/08-preview-and-env-gotchas.md` — hidden preview tab pauses rAF (verify via eval, not screenshots); `<picture>` 404; no jq/ffmpeg; muted autoplay; graceful fallbacks.
- `memory/09-quality-bar.md` — the taste bar and the exact auto-rejects.
- `memory/10-brief-and-storyboard.md` — brand inputs + the storyboard table (one row per act, one signature moment) BEFORE generating anything.
- `memory/11-motion-timing.md` — easing vocabulary, timing cheat sheet, reveal/split/counter/marquee patterns, transform+opacity only.
- `memory/12-performance-a11y-mobile.md` — budgets (LCP, CLS, JS, frames), GPU guards, accessibility, mobile strategy.
- `memory/13-qa-and-delivery.md` — the full QA checklist, Playwright screenshots (`scripts/shots.mjs`), deliverables.
- `memory/14-other-modes.md` — when the client has a real GLB (3D route) or wants an existing site upgraded (analyzer + optimizer scripts).

## The kh3don-skill skill (`.claude/skills/kh3don-skill/`)
Loaded automatically by Claude Code. Use it for real-time 3D (a GLB model, Three.js / React Three Fiber), for deeper reference material (scroll choreography patterns, polish, QA), and to analyze and upgrade an existing website. Its path B is this kit's AI product film.

## Non-negotiables (the short version)
1. **Smooth scroll storytelling.** Lenis driven by GSAP's ticker (one rAF). All motion scroll-triggered, slow, contemplative.
2. **The film = canvas frame sequence.** Never `video.currentTime` scrubbing (it stutters → rejected).
3. **Seamless.** Transformations are real boundary-matched video clips (clip N end-image == clip N+1 start-image); never ghost two stills together; unify edge/background color across all keyframes.
4. **Cinematic hero**, not a static image + fade. Transparent cutout (no blend trick on animated elements).
5. **Ambient mood shifts per section** via a tweened `#ambient` layer.
6. **Header** hides on scroll-down, returns on scroll-up (never removed).
7. **CTA:** product video alone first → scroll reveals a dim/wash + order content.
8. **Typography:** clean, high-contrast. Arabic = El Messiri (headings) + Tajawal (body), never Amiri. Captions off-center (right in RTL).
9. **Modesty** for any people (full hijab, conservative); **exact product identity** across all assets.
10. **Graceful fallbacks** (`prefers-reduced-motion` + missing-asset gradient) and a fast, fully responsive page that starts directly on the product.
11. **Budgets and access:** LCP < 2.5 s, CLS < 0.1, real text in the DOM, keyboard works with Lenis, contrast ≥ 4.5:1 (`memory/12`).

## Build order
1. **Analyze the product + its reference photos.** Decide theme (light/dark), story (the transformation), palette (from the product), and copy. If there's a real GLB, or an existing site to upgrade, see `memory/14` first.
2. **Write the storyboard** (`memory/10`): one row per act, the film's beat list K1→K5. Share it before spending generation credits.
3. **Scaffold the page** from `templates/index.skeleton.html` (the engine is already correct) — wire your sections, copy, palette, and asset paths.
4. **Write the Higgsfield prompt list** from `templates/HIGGSFIELD-PROMPTS.template.md` (numbered, boundary-matched, identity + modesty clauses).
5. **Generate assets** (see `memory/06`): references → image keyframes → boundary-matched clips → extract frame sequence → cutout for the hero. Verify each by looking at it.
6. **Verify in preview via `eval`** (the tab is hidden → screenshots/animations won't show; check structure, computed styles, console errors, and force end-states). Then run `node scripts/shots.mjs <url>` for real screenshots at 1440/1024/390. Web-optimize heavy assets.
7. **Hold the quality bar** (`memory/09`) and run the QA checklist (`memory/13`). Iterate the hero hardest. Hand over the deliverables listed in `memory/13`.

> Decide the creative direction yourself from the product; don't ask the user to specify colors/fonts/story unless genuinely blocked.
