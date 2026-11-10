# AI asset pipeline (Higgsfield)

How to generate the images, clips, frame sequence and cutouts for path B (`ai-product-film.md`), or the poster and backdrops for path A, with the Higgsfield CLI, MCP server or `higgsfield-generate` skill. Log in with `higgsfield auth login` and check with `higgsfield account status`. The numbered prompt template is `assets/HIGGSFIELD-PROMPTS.template.md`.

## Contents
1. Two hard rules for every prompt
2. Model picks
3. Submit, parse and download
4. Retries, uploads and parallel runs
5. Frame extraction with OpenCV
6. Web-optimizing the results

## 1. Two hard rules for every prompt

**Modesty (mandatory for Arab and Muslim audiences).** Whenever people appear (lifestyle, gatherings, iftar, hospitality), every woman is fully covered: an elegant hijab over the hair and conservative long sleeves. Snippet: *"an elegant woman wearing a MODEST hijab that fully covers her hair, with conservative long-sleeved clothing, tasteful and respectful — no skin beyond face and hands"*. Men, families and hospitality settings work well.

**Exact product identity.** Logo, wordmark, shape and packaging stay identical across every asset; drift looks like a different product. Use identity-preserving image-to-image with the reference and state *"keep the exact product identity / emblem / calligraphy unchanged"*. The same clause powers variant re-skins (*"re-skin into a deep ruby-red body, keeping the SAME emblem"*). Put the brand mark where it really lives: if the name is printed on the box, never engrave it onto the bare product. For a nav logo, generate the emblem alone, flat on pure black or white, then remove the background.

**Look at every generated image before animating it or spending video credits on it.** Both rules are verified by eye.

## 2. Model picks

| Need | Model | Notes |
|---|---|---|
| Identity-preserving product shots and keyframes | `nano_banana_2` | Pass the reference with `--image`; `aspect_ratio` 1:1, 3:2, 2:3, 16:9… |
| Scenes with no product identity (backdrops, landscapes) | `gpt_image_2` | `quality high`, `resolution 2k` |
| Image-to-video clips | `seedance_2_0` | `--start-image`, `--end-image`, `--aspect_ratio`, `--resolution 1080p`, `--duration <int>`, `--bitrate_mode high`, `--generate_audio false` |
| Transparent cutouts (hero, floating product, logo) | `image_background_remover` | Just `--image` |

Model names change; confirm with the generator's model list before a large batch.

## 3. Submit, parse and download

```bash
higgsfield generate create <model> ... --wait --wait-timeout 25m --json > out.json
```

The result URL is the top-level `result_url`. The job JSON also lists the input URLs, so a naive "first URL" grab can return the input. Without `jq`:

```bash
URL=$(grep -oE '"result_url":[[:space:]]*"[^"]+"' out.json | grep -oE 'https://[^"]+' | head -1)
for d in 1 2 3; do curl -fsSL "$URL" -o asset.jpg && [ -s asset.jpg ] && break; sleep 3; done
```

Check that the downloaded file exists and is not empty. A failed download leaves a missing or 0-frame mp4 that breaks extraction later.

## 4. Retries, uploads and parallel runs

- **Retry transient errors.** Intermittent `HTTP 502` and "Cannot reach …cloudfront…/<uuid>.png" (the backend failed to fetch a just-uploaded input) are flaky, not misuse. Wrap every generation in a 3–4× retry loop.
- **Upload references once**: `higgsfield upload create ref.jpg --json`, capture the `id`, and pass it to `--image <id>` on every later call. It skips re-uploads and avoids the flaky re-fetch.
- **Fan out**: image generations are reliable, so launch them in parallel (`&` plus `wait`) in one background script. Video clips depend on the keyframes, so run them in a second pass and check every result.

## 5. Frame extraction with OpenCV

Use this when `ffmpeg` is not installed (`pip install opencv-python`). It writes one continuous sequence and drops the duplicated boundary frame of clips 2..N:

```python
import cv2, os, glob
clips = ["v1.mp4", "v2.mp4", "v3.mp4", "v4.mp4"]; out = "assets/seq"; os.makedirs(out, exist_ok=True)
for f in glob.glob(out + "/f*.jpg"): os.remove(f)
PER, W, idx = 24, 1280, 0
for ci, p in enumerate(clips):
    cap = cv2.VideoCapture(p); total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
    if total <= 0: print("WARN empty", p); cap.release(); continue
    picks = [round(i * (total - 1) / (PER - 1)) for i in range(PER)]
    if ci > 0: picks = picks[1:]
    for fr_i in picks:
        cap.set(cv2.CAP_PROP_POS_FRAMES, fr_i); ok, fr = cap.read()
        if not ok: continue
        h, w = fr.shape[:2]; fr = cv2.resize(fr, (W, round(h * W / w)))
        cv2.imwrite(f"{out}/f{idx:03d}.jpg", fr, [cv2.IMWRITE_JPEG_QUALITY, 80]); idx += 1
    cap.release()
print("frames:", idx)  # set FRAME_COUNT in the HTML to this number
```

Four clips × 24 frames minus 3 duplicates is 93 frames. Keep the page's `FRAME_COUNT` in sync with the real count.

## 6. Web-optimizing the results

Generated stills are often 6–10 MB. Downscale display images to about 2000–2600 px (JPEG quality about 87) and keep full-resolution keyframes only as video sources. `scripts/optimize-assets.cjs` produces an optimized copy of a finished build, and the analyzer gives a before/after table (`analyze-and-upgrade.md`). Videos load lazily (CTA only), but count their weight in the budget in `polish-and-qa.md`.
