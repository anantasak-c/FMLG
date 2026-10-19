---
name: create-flux3-video
description: Direct, prompt, generate, continue, and enhance videos with Black Forest Labs FLUX.3. Use when the assistant must interview a user about a video idea, develop a treatment or shot plan, write or audit a FLUX.3 prompt, prepare API payloads, animate one or more stills, interpolate timed keyframes, continue an existing MP4, render a saved draft at full quality, generate synchronized audio or dialogue, submit a FLUX.3 API job, poll it, or download its result.
---

# Create FLUX.3 Video

Turn an idea or source asset into a shootable FLUX.3 brief, a ready-to-copy prompt, a valid API payload, and—only when requested—an executed generation.

## Load the required references

Read these files before producing a final prompt or API request:

1. Read [references/direction.md](references/direction.md) for the interview, directing method, prompt construction, and quality gate.
2. Read [references/flux3-api.md](references/flux3-api.md) for mode selection and the current request schema.

Treat the official schema as volatile. If the user asks for current pricing, newly released capabilities, or exact production behavior, verify against the official BFL documentation linked in `flux3-api.md` before answering or spending credits.

## Choose the workflow

Select exactly one primary mode:

| User has | Mode | Result |
| --- | --- | --- |
| An idea or text brief | `t2v` | Create a new shot from text |
| One or more still images | `i2v` | Animate a start frame, bridge endpoints, or interpolate keyframes |
| An existing MP4 to extend | `v2v` | Continue naturally from its final frames |
| A downloaded FLUX.3 draft cache | `draft_enhance` | Reproduce that draft at full quality |

Do not present unavailable features as working. Video editing and omni-reference were marked “Soon” in the official guide when this skill was authored; verify them before claiming support.

## Interview one question at a time

Use a focused grilling interview when essential direction is missing. Ask one decision-changing question per message, use the answer to choose the next question, and stop when the brief is executable. Prefer concrete choices or a recommended default.

Resolve, in order:

1. Source mode and available assets.
2. Intended viewer, platform, and success criterion.
3. Duration and aspect ratio.
4. Subject, immediate action, obstacle or change, and final image.
5. Camera behavior, environment, lighting, and continuity locks.
6. Audio, dialogue, language, and delivery.

Do not interrogate a user who asks for speed or supplies a complete brief. State reasonable assumptions and proceed. Never ask for an API key in chat; use `BFL_API_KEY` from the environment.

## Build the generation package

Follow the directing workflow in `references/direction.md`, then return the smallest useful package:

- **Prompt only:** mode, parameters, assumptions, and one ready-to-copy English prompt. Follow the user's language for explanation; preserve requested dialogue in its intended language.
- **Production package:** add a compact shot/beat plan, continuity locks, audio plan, and valid JSON payload.
- **Audit:** identify generation risks, unsupported parameters, conflicting directions, weak physical action, timing overload, and then provide a corrected prompt and payload.
- **Execute:** show the final prompt, mode, duration, resolution, audio setting, and any credit-bearing action; obtain explicit approval immediately before the API call unless the user already explicitly asked to run it with these exact settings.

Use `resolution: "hd"` and `draft: true` for an exploratory first pass unless the user requests a final render. Preserve the returned draft cache immediately if the user may enhance it later.

## Execute safely

Use `scripts/flux3_video.py` instead of rewriting API and polling logic when that execution capability is available in the runtime.

Do not print, persist, or place the API key in payloads. Download result media and draft-cache artifacts promptly because delivery URLs may expire. On `402`, stop and report insufficient credits. On `429`, allow backoff to run. On moderation or error status, report the status and details without repeatedly resubmitting.

## Final quality gate

Before returning or executing, verify:

- The selected mode matches the supplied source.
- Every visible beat contains filmable physical action.
- The timing fits 5–20 seconds and does not overload the clip.
- Camera movement has one clear motivation; instructions do not conflict.
- Spatial relationships and continuity locks are explicit.
- Audio sources correspond to visible or plausible events; quoted dialogue can fit.
- The final image is named.
- The JSON uses only fields allowed for its mode.
- The user has approved any credit-bearing call.

Fix failures before shipping.

## Attribution

The directing framework adapts ideas from Serge Shima's Visual Skills under CC BY 4.0. Preserve the attribution in `references/direction.md` in redistributed derivatives.
