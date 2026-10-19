# 04: Production AI Coach and Creative Brief

Type: task
Status: resolved

## Work

- Replace the demo/Kling assumptions in the old vertical slice with the server-only OpenRouter Prompt Engine port from ADR 0032.
- Implement an adaptive one-question-at-a-time Thai Grill that terminates when the brief is sufficient for the selected source mode/tier; it must not use a fixed question count.
- Support Publishing Target, Audio Choice, Thai Dialogue Preview, Text-to-Video, and single-image Image-to-Video.
- Keep the compiled English provider prompt server-side in LIFF; expose the Advanced Prompt View only on web.
- Retain deterministic fake adapters for tests and protect live OpenRouter calls behind server-only configuration.

## Acceptance criteria

- A user can proceed from short Thai idea to Ready-to-Generate Brief without technical parameters.
- A complete opening brief offers Create now / Adjust more rather than asking gratuitous questions.
- Tests cover safe stop behavior, ambiguity follow-up, dialogue preview, source mode, and no raw prompt exposure in LIFF.

## Comments

- 2026-08-24: Claimed. Replaced the fixed three-question demo grill with a Thai-first, one-question adaptive flow. It stops once the brief is sufficient instead of reaching an arbitrary count, supports Text-to-Video or one-image Image-to-Video, Publishing Target, Audio Choice, and optional Thai Dialogue Preview. The initial Provider Profile is now FLUX.3 rather than Kling. Unit tests cover safe stop, image source requirement, and dialogue flow; all tests, typecheck, and production build pass.
- 2026-08-24: The live Prompt Engine adapter will use server-only OpenRouter Chat Completions for the customer pilot, as recorded in ADR 0032, rather than the direct OpenAI Responses choice in ADR 0017. `OPENROUTER_API_KEY` and an explicit model slug are required; LIFF continues to expose no compiled provider prompt and Advanced Prompt View remains a web-only Ticket 08 feature.
- 2026-08-24: Added server-only OpenRouter Prompt Engine port and deterministic fake. The adapter sends the key exclusively in the authorization header and has no browser import path. Live requests remain disabled until the Coach API workflow is wired and a capped test budget is confirmed.
- 2026-08-24: Added the server-only `POST /api/coach/question` workflow. It accepts a compact Creative Brief and returns only one Thai follow-up question; system instructions prohibit prompt syntax, model names, and provider settings. The default model is OpenRouter's `openrouter/free` router.
- 2026-08-24: Confirmed Creative Harness design: one live creator-visible Economy tier, Text-to-Video and single-image Image-to-Video, versioned curated Knowledge Base, one Pilot Credit preview, and provider-policy-plus-FOMOlogy quality blocks. ADR 0033 records the deliberate shift from FLUX.3-first to the Runpod/ComfyUI Economy Video Engine.
- 2026-08-24: Added the Skill Registry, tagged deployable Knowledge Base snapshot, structured Creative Brief assumptions, risk-specific negative constraints, continuity checklist, Quality Gate, immutable Prompt Package persistence seam, and creator-safe preview route. The web Grill is now a one-question modal with choices, a recommendation, custom answer, ask-AI, pause/resume, and no raw prompt. LIFF never renders compiled provider prompts. AI Coach provider consent is explicitly collected and a versioned authenticated-consent migration is included.
- 2026-08-24: Verification: `npm test` passed (9 test files) and `cmd.exe /C npm run build` passed. Before using the LIFF consent action against Supabase, apply `202608240003_ai_coach_consents.sql` in the Supabase SQL Editor; until then this ticket remains claimed rather than resolved.
- 2026-08-24: Supabase migration `202608240003_ai_coach_consents.sql` was applied and confirmed by the operator. Ticket resolved.
- 2026-08-25: Reworked the creator-facing web flow after product review. Production no longer drives the old hardcoded `QUESTIONS` list: `/api/coach/chat` now runs a deep-module Coach Brain that loads literal base/provider `SKILL.md` packages, asks one model-selected decision frontier with 2–4 distinct treatments, applies allowlisted brief patches, and stops on a validated ready package. Ox Alpha is attempted first with the free router as a rate-limit fallback. Invalid structured output receives one Repair/Critic pass only. The web exposes Skill badges/override and Advanced Prompt View; LIFF stays provider-opaque. FLUX.3 support is prompt + schema-validated dry-run payload only and cannot call BFL or spend credits.
- 2026-08-25: Verification passed: 10 Node test files, Windows TypeScript check, local Ox/free-fallback live turn (structured question, three choices, both Skills, no repair/fallback), local Next.js production build, and Vercel Preview build. Deployed Preview: `https://fmlg-customer-pilot-1nb1w9crk-anantasak-cs-projects.vercel.app`.
- 2026-08-25: Fixed the deployed chat-loading failure. Runtime evidence showed `Prompt Engine returned no content`; the adapter now requests JSON mode, hedges a slow/empty Ox response with the free router, bounds provider attempts, and Coach Brain contains provider exceptions with a validated safe decision card instead of returning 503. Slow invalid responses no longer trigger an unbounded third repair call. The client shows staged progress, aborts after 35 seconds, and restores the unsent draft on a true network timeout. Regression tests cover empty content, thrown provider errors, and exhausted repair budget. Local live verification returned HTTP 200 with three choices in 31.2 seconds versus the previous 48.5-second/503 path.
- 2026-08-25: Fix deployed successfully to Preview `https://fmlg-customer-pilot-7f50aphm7-anantasak-cs-projects.vercel.app` (deployment `dpl_3PSVKzos37UacefMydHJWFLctWsB`, READY).
- 2026-08-25: Product review replaced the web-only structured Coach Brain with a simpler Skill Chat runtime. A new room selects either General or the full `create-flux3-video` Skill, then sends normal conversation history to Ox Alpha and renders a free-form Markdown stream. The web route no longer requires Creative Brief patches, decision cards, JSON envelopes, repair passes, or deterministic fallback questions. Skill selection is locked per room; Stop, partial-response retention, retry, local session v2, and v1 transcript migration are included. LIFF and legacy authenticated Prompt Package boundaries are unchanged.
- 2026-08-25: Verification passed: 11 Node test files, TypeScript, local and Vercel production builds, and real-browser FLUX.3 chat. Browser QA confirmed free-form Thai Markdown, distinct creative directions, progressive streaming, Stop with partial-response retention, and local-storage restoration after reload. Production deployment `3MMrvz2Vq7kenBWo4bWha9sKksYf` is aliased at `https://fmlg-customer-pilot-gray.vercel.app`.
