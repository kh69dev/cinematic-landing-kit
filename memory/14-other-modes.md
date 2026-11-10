# 14 · Other Modes: a Real 3D Model, or Upgrading an Existing Site

This kit's default is the AI product film. Two other situations come up often.

## A. The client has a real 3D model (GLB/GLTF)
Use real-time 3D for the signature moment instead of (or alongside) the film.
1. **Optimize first:** `scripts/optimize-model.sh input.glb models/hero.glb` (glTF-Transform + meshopt, typically 70–90% smaller). Load with `GLTFLoader` + `MeshoptDecoder`. Targets: hero model < 2 MB, all 3D < 5 MB.
2. **Light for the material:** metals need an environment map (`RoomEnvironment` through `PMREMGenerator`, or an HDRI), `ACESFilmicToneMapping`, `SRGBColorSpace`, a warm key and a rim light. Without an environment, gold renders flat brown.
3. **Frame by bounding box:** `Box3`, center the model, set camera distance from FOV and size, then tune by eye.
4. **Poster first:** render a still at the exact canvas framing. It is the first paint, the no-WebGL fallback and the `og:image`. Cross-fade to the live canvas when the model is ready.
5. **Drive named parameters from scroll** (camera angle and radius, model rotation, light intensity) with GSAP timelines (`scrub`), never raw scroll numbers. Pause rendering offscreen and in hidden tabs; cap DPR.
6. **Respect the mark:** gentle rotation (about ±25°), never stretch or recolor the logo.
STL has no materials (convert it); FBX/OBJ go through Blender (File > Export > glTF 2.0). The full procedure and a no-build Three.js starter live in the `kh3don-skill` skill (`references/3d-scene.md`, `assets/starter/`).

## B. Upgrading an existing website
When the user shares a current site (URL, build folder or zip), measure before redesigning:
1. **Measure:** `node scripts/analyze-site.cjs <url|folder|zip> --out audit/before` produces `report.md`, `report.json`, screenshots and a content inventory (sections, headings, CTAs, colors, fonts, stack).
2. **Look:** open the screenshots and note what a script can't judge (weak hero, off-brand type, inconsistent brand name).
3. **Optimize:** `node scripts/optimize-assets.cjs <folder|zip> --out audit/site-optimized --report audit/before/report.json --webp`, then re-run the analyzer with `--baseline audit/before/report.json` for a before/after table.
4. **Recommend:** what to keep, what to fix first, fix-in-place vs re-skin vs rebuild, and a storyboard ([10](10-brief-and-storyboard.md)) mapping current sections to cinematic acts.
5. **Build and verify:** build with this kit, then re-run the analyzer against the original baseline.

One command for steps 1 and 3: `scripts/analyze-and-upgrade.sh <url|folder|zip> [out-dir]`. Setup: `npm i -D playwright sharp && npx playwright install chromium`. Headless timings run on a software GPU, so compare before vs after rather than reading them as field data.
