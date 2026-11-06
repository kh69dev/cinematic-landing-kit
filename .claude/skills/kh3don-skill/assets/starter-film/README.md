# kh3don film starter (path B)

A single-file cinematic product page for when there is no 3D model: Lenis smooth scroll on GSAP's ticker, a header that hides on scroll-down, per-section ambient color, a living 2D hero built from a transparent cutout, a scroll-scrubbed canvas frame-sequence film, a CTA video reveal and graceful fallbacks. Default theme is light, and the default language is Arabic RTL.

## Run

```bash
npx -y serve -l 8123 .   # launch.json holds the same config for preview tools
```

## Make it yours

1. **Placeholders:** fill every `{{PLACEHOLDER}}` (product name, copy, palette, `LANG`/`DIR`).
2. **Assets:** generate them from `../HIGGSFIELD-PROMPTS.template.md` following `references/ai-asset-pipeline.md`, using the exact file names the HTML expects under `assets/`.
3. **Frames:** extract the clips into `assets/seq/f000.jpg …` and set `FRAME_COUNT` to the real number of frames.
4. **Theme:** to go dark, swap the palette variables and ambient values and use `mix-blend-mode: screen` with black-background assets (`references/ai-product-film.md` section 5).
5. **Verify:** check with `eval` in hidden preview tabs and with Playwright screenshots (`references/polish-and-qa.md` sections 9 and 10).
