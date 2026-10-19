# FOMOlogy directing method

Knowledge version: `video-prompt-kb-2026-08-21.v1`

Use these tagged rules selectively and record their IDs in the output.

## `audience-promise` — core

- Start with what the intended viewer should feel, believe, or remember.
- Every visual, audio, and action detail must serve that single experience.

## `timeline-and-beats` — core, timeline

- Treat duration as a budget. Give every visible beat a time range and a decisive final image.
- A major action needs readable preparation, contact or evasion, and result or recovery.
- Reduce beats when the requested action density cannot fit.

## `continuity-anchors` — character, image-to-video

- Lock exact character count, age range, costume, signature props, scale, and left-right placement when material.
- Preserve supplied-image identity and visible anchors; do not invent a second reference.

## `camera-audio-causality` — camera, audio

- Give camera motion, shake, focus changes, damage, and sound a physical cause in the world.
- Dialogue must fit its time range and come from a visible or plausible speaker.

## `cultural-specificity` — culture, Thai

- Express Thai references through world, material, sound, and performance structure—not generic “Asian” or cyberpunk decoration.
- Preserve requested Thai dialogue verbatim in the generation prompt.

## `risk-specific-negative-constraints` — negative, core

- Name actual failure risks: genre drift, camera violations, artifacts, identity changes, text, logos, and unsafe content.
- Put reliable typography, logos, subtitles, and detailed graphic layouts in post-production.

## Quality gate

Block an export for contradictory anchors, an impossible timeline, missing source media for the selected mode, known policy violations, or dialogue that cannot fit. Warn for visible assumptions, excess action density, or underspecified continuity. Verify the final image and physical causality before declaring readiness.

The framework adapts ideas from Serge Shima's Visual Skills under CC BY 4.0.
