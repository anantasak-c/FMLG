# FLUX.3 API reference snapshot

Verified against the official BFL documentation on 2026-08-25. Treat the schema as volatile and verify the official reference again before enabling live execution.

Endpoint: `POST https://api.bfl.ai/v1/flux-3-video`

The product produces dry-run JSON only and must never include an API key.

## Shared fields

- `prompt`: required non-empty string.
- `mode`: exactly one of `t2v`, `i2v`, `v2v`, `draft_enhance`.
- `aspect_ratio`: `auto`, `21:9`, `2:1`, `16:9`, `4:3`, `1:1`, `3:4`, or `9:16`.
- `duration`: `auto` or a whole second. `t2v`/`i2v` allow 5–20 seconds; `v2v` allows 5–15 seconds.
- `resolution`: `hd` or `fhd`; default to `hd` for exploration.
- `version`: `latest`.
- `generate_audio`: boolean, default `true`.
- `safety_tolerance`: integer 0–4; use the conservative default `2`.
- `draft`: boolean. Use `true` for an exploratory first pass.

## Mode assets

- `t2v`: no source asset.
- `i2v`: `keyframes` is required. A single `[0, image]` entry anchors the start; timed keyframes must be ordered. Customer pilot accepts exactly one source image.
- `v2v`: `start_video` is required.
- `draft_enhance`: `draft_cache` is required and `draft` must not be true.

Do not add keys outside the selected mode's schema. A live request would return an asynchronous `id` and `polling_url`, but live submission is outside this skill's current authority.
