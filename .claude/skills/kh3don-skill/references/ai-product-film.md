# Path B: AI product film (no 3D model)

Use this path when the client has product photos but no GLB, or when the brief is a luxury product page that should feel like a TV ad (Apple × Cartier / Hermès). The signature moment is a scroll-scrubbed **film**: a continuous product transformation rendered as a frame sequence on a `<canvas>`. Assets come from an image/video generator (see `ai-asset-pipeline.md`). The no-build starter is `assets/starter-film/index.skeleton.html`.

## Contents
1. Page structure
2. The film: canvas frame sequence
3. Seamless transitions between clips
4. The cinematic 2D hero
5. Theme, ambient layers and the blend trap
6. Header, captions and the CTA reveal
7. Arabic typography
8. Auto-rejects

## 1. Page structure

1. **Hero**: starts directly on the product, never on an empty splash (section 4).
2. **Film**: a tall section (about 600vh) with an inner `position: sticky; top: 0; height: 100svh` stage. Scroll drives the transformation (section 2).
3. **Product reveal**: the hero shot, specs and subtle parallax accents in an editorial layout.
4. **Ritual / moments**: a lifestyle beat. People are optional and must follow the modesty rule in `ai-asset-pipeline.md`.
5. **CTA**: a pinned section where the product video plays alone first, then a dim or wash layer and the order content fade in (section 6).
6. **Variants / editions** (optional): re-skinned product cards.
7. Footer.

Sections differ visually but connect through a tweened ambient background, never hard cuts.

## 2. The film: canvas frame sequence

**Never scrub a `<video>` with `video.currentTime = progress * duration`.** H.264 decodes from the nearest keyframe on every seek, so the page stutters and drops frames. It is the most common reason a "cinematic" page feels cheap.

Convert the clips into one numbered JPG sequence and draw the current frame on a canvas:

1. **Extract**: about 24–30 frames per clip, resized to about 1280 px wide, JPEG quality about 80, concatenated into `f000.jpg … fNNN.jpg`. 90–120 frames are about 5–8 MB. Drop the duplicated first frame of clips 2..N (boundary frames are shared, section 3). OpenCV recipe: `ai-asset-pipeline.md`; `ffmpeg` also works where installed.
2. **Preload** all frames into `Image[]` behind a percentage preloader. Mark the film ready at about 60% loaded or when every request has settled, with a safety timeout of about 9 s so one stalled frame cannot hang the page. If nothing loads, show a static fallback image.
3. **Scrub** with one ScrollTrigger:

```js
const filmST = ScrollTrigger.create({
  trigger: "#film", start: "top top", end: "bottom bottom", scrub: true,
  onUpdate: (s) => { if (ready) draw(Math.round(s.progress * (N - 1))); updateCaptions(s.progress); },
});
```

4. **`draw(i)`** uses object-cover math, caches the current index to skip redundant draws, sets `canvas.width/height = clientW/H * min(2, devicePixelRatio)` and redraws on resize. Fill the canvas with the frames' edge color first, so a full-bleed canvas shows no border or letterbox.
5. **When the film becomes ready, draw the frame for the current scroll position** (`filmST.progress`), not frame 0. Otherwise a visitor who scrolled during loading sees the wrong still until the next scroll.

The 3D-path recipe in `scroll-choreography.md` section 5 (`gsap.to(seq, { frame })` with a pin) is fine for short spins. Use this version for a long hero film.

## 3. Seamless transitions between clips

1. **Never cross-dissolve two different stills** to fake a morph. It produces a double-exposure ghost. Any transformation is a real video clip.
2. **Boundary-match the clips.** Generate each clip image-to-video with both a start image and an end image, and make clip N's end image the same file as clip N+1's start image:

```
K1 ──V1──▶ K2 ──V2──▶ K3 ──V3──▶ K4 ──V4──▶ K5
each Vn: start-image K(n), end-image K(n+1)
```

3. **Match edges and background across all keyframes.** Prompt every keyframe with the identical background spec and an explicit edge color, for example "seamless warm off-white #FBF8F2 fading to the same tone at every edge and corner".
4. **Bridge big jumps** (a full-screen object becoming a small one) with an intermediate keyframe and two clips instead of one hard morph.
5. Keep the camera slow and locked: "no cuts, no flicker, slow motion, no morphing artifacts". With people, add "no face distortion" and keep motion subtle.

Order: keyframes first (identity-preserving image-to-image), then the boundary-matched clips, then the frame extraction.

## 4. The cinematic 2D hero

A static image plus a fade-in reads as "just another website". The hero must feel alive and flow into the film.

Use a **transparent product cutout** (background-removed PNG) with a soft `drop-shadow`, not a blend-mode trick (section 5). Nest wrappers so each owns one transform channel:

```
.stage (perspective)
  .aura            gold radial light: entrance fade, slow pulse, pointer parallax
  .motes           ~8 drifting dust particles (CSS keyframes, varied delay and size)
  .hero-inner
    .eyebrow
    .media-float   CSS float (translateY bob)
      .media-tilt  JS pointer-driven rotateX/rotateY
        img.cutout GSAP entrance (scale, rotate, opacity)
        .specular  moving sheen masked to the silhouette: mask: url(cutout.png) center/contain no-repeat
    h1             GSAP clip-path reveal
    .sub
  .scrollcue
```

1. **Entrance** on load: the cutout scales and rotates in, the wordmark reveals with `clip-path: inset(...)`, eyebrow, sub and cue stagger in. About 1.5 s, `power3.out`.
2. **Continuous life**: aura pulse, rising motes, gentle float, a sheen sweeping across the product.
3. **Pointer depth**: tilt the product on `pointermove` and drift the aura and motes the opposite way. Reset on `pointerleave`. Fine pointers only.
4. **Scroll handoff**: fade and lift the whole composition while the aura expands, flowing into the film.

Guards: under `prefers-reduced-motion`, drop the loops and entrance and show the final state. If GSAP fails to load, force-reveal everything that starts at `opacity: 0`. Keep the wordmark from overlapping the product, and keep the hero about 130vh tall so there is no empty gap.

Environmental beats (origin, heritage) get the same energy: full-bleed and pinned, a slow Ken Burns push, a growing glow and a masked line-by-line text reveal.

## 5. Theme, ambient layers and the blend trap

**Choose the theme from the product photography.**
- **Dark luxury** (espresso or black grounds, raking light): assets on near-black backgrounds dropped onto the page with `mix-blend-mode: screen`.
- **Light gallery** (ivory or sand grounds, soft daylight, negative space): assets on white dropped with `mix-blend-mode: multiply`. A product shot white-on-white usually means light is right.

Light palette that worked (adapt the hues): `--paper:#FBF8F2; --sand:#ECE2CF; --cream:#F3EEE2;` headings `#241812`, body `#6E5C4B`. Gold must be deep to read on light (`#A97B33 → #8A6128`); pale gold disappears on white.

**The blend trap.** `mix-blend-mode` (multiply or screen) breaks on any element GSAP transforms: the transform creates a stacking context, so the element blends against white or black instead of the page and shows a visible rectangle. Use transparent cutouts for anything animated, especially the hero. Keep blend modes for static, untransformed shots.

**Fixed cinematic layers** behind the content:
- `#ambient`: full-screen background color tweened per section with GSAP color interpolation (about 1.1 s) on each section's `onEnter` / `onEnterBack`. Light themes shift warmth (ivory → sand → honey); dark themes shift depth (espresso → warm brown → near-black). Watch text contrast mid-tween.
- `#glow`: soft radial light whose opacity shifts per section.
- `#vignette`: subtle edge darkening.
- `#grain`: faint SVG fractal-noise film grain at low opacity.
- `#progress`: a thin gold scroll-progress bar at the top.

## 6. Header, captions and the CTA reveal

**Header**: carries the emblem and wordmark, hides on scroll-down and returns on scroll-up. Never remove it.

```js
ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => {
  progress.style.transform = `scaleX(${self.progress})`;
  header.classList.toggle("solid", self.scroll() > 40);
  if (self.scroll() > 140) header.classList.toggle("hidden", self.direction === 1);
  else header.classList.remove("hidden");
}});
```

**Captions over the film**: small, high-contrast and off-center (right in RTL) so they don't fight the subject. Drive each one's opacity from the film's `onUpdate` with a `smoothstep` window (`data-a` / `data-b` progress range). The opening centered title is fine; later centered text is not.

**CTA reveal**: a tall pinned section with a scrubbed, `smoothstep`-gated reveal. The video plays alone for the first third, then a dim layer (a warm-white wash in light themes) and the order content fade in. Cycle several short clips as a playlist that advances on `ended`.

## 7. Arabic typography

Clean beats calligraphic for luxury. Use **El Messiri** for headings and **Tajawal** for body text; avoid **Amiri** for large display. Cormorant Garamond works for Latin accents. Editorial section indices can use Arabic-Indic numerals (٠١، ٠٢). Full RTL rules are in `polish-and-qa.md`.

## 8. Auto-rejects

- Choppy scroll or dropped frames from scrubbing `video.currentTime`.
- A hero that is a static image plus a fade.
- Two stills cross-dissolved to fake a transformation.
- A visible rectangle around an animated image (the blend trap).
- Captions centered over the subject after the opening title.
- A header removed entirely instead of hiding on scroll-down.
- Placeholder or reused rejected assets, a drifting product identity, or a person who breaks the modesty rule.
- A broken-image box when an asset 404s (use the fallback pattern in `polish-and-qa.md`).
