# 10 · Brief & Storyboard (before any generation)

Generating assets is the expensive step, so lock the story first. Analyze the product yourself and decide; ask the user only for what is genuinely missing.

## Inputs to gather
1. **Brand system:** colors as hex, typefaces, logo files, tone of voice, any guideline PDF. A guideline overrides your taste: follow its palette, type scale and rules exactly (e.g. "flat gold in UI, metallic gradients only in visuals").
2. **Product references:** the clearest photos of the product and its packaging, plus where the brand mark really lives (see [07](07-modesty-and-identity.md)).
3. **Goal and audience:** the ONE action the page drives (buy, order on WhatsApp, book, sign up).
4. **Content:** real headlines, specs, proof (numbers, clients, testimonials) and prices. Never ship lorem ipsum.
5. **References:** sites or ads the user admires, each with the specific technique you're borrowing ("the camera pushes into the bottle as it fills"). "Make it like X" is not a technique.
6. **Constraints:** hosting, language and direction (RTL), deadline, device mix.

## Storyboard = one row per section
Write it as a table and share it before generating anything:

| Act | Section | Purpose | Scroll length | Motion | Copy |
|---|---|---|---|---|---|
| 1. Hook | Hero | Prove quality in 2 seconds | ~130vh | Living cutout (entrance, aura, tilt, sheen) | Brand line |
| 2. Transformation | Film | The signature moment | ~600vh sticky | Canvas frame-sequence | 3–4 off-center captions |
| 3. Reveal | Product | What it is | normal | Subtle parallax accents | Specs, short lines |
| 4. Moment | Ritual | Why it matters | pinned ~150vh | Ken Burns + masked text | One sentence |
| 5. Climax + CTA | CTA | The ask | pinned ~200vh | Video alone, then wash + order content | Plain, specific ask |

Then write the film's beat list (K1 → K5) from the storyboard: it becomes the keyframe and clip list in `templates/HIGGSFIELD-PROMPTS.template.md`.

## Rules that make it memorable
- **One signature moment.** The transformation film is it; keep the rest quiet so it lands.
- **Rhythm.** Alternate intense acts (pinned, film) with calm ones (plain scroll, generous space). Constant intensity tires the eye and the GPU.
- **Scroll is time.** About 100vh of scroll is one beat. A pinned act longer than ~600vh feels stuck unless the film keeps changing.
- **Copy carries meaning, motion carries emotion.** Never hide essential information (price, how to order) behind an animation.
