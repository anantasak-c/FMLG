Status: ready-for-agent

# FOMOlogy Customer Pilot MVP

## Outcome

Ship a closed customer pilot where an allowlisted LINE user can open the LINE MINI App, complete an adaptive Thai AI Coach flow, choose a FLUX.3 Economy or High Quality generation, pay with Coin when needed, receive a private video result and LINE completion message, then download it within 15 days. The primary product metric is **First Generation Success**.

## Confirmed scope

- LINE MINI App is the primary beginner channel; web is the advanced Studio.
- Authentication and allowlisting are based on LINE account identity.
- Adaptive Grill asks one compact question at a time and stops when the Creative Brief is sufficient; it has no fixed question cap.
- Text-to-Video and single-image Image-to-Video are available in the pilot. Video-to-Video is out of scope.
- FLUX.3 tiers: Economy = Draft, High Quality = Video, then optional 2K Upscale = Video Upscaler after a completed source video exists.
- Each eligible account receives one Economy Generation as Pilot Credit. Subsequent use requires Wallet Coin; purchased Coin does not expire during the pilot.
- Use PromptPay QR + SlipOK verification for Coin top-up. Debit before request, refund automatically only for irrecoverable provider/system failure.
- Results are private, have no FOMOlogy watermark, can be downloaded for 15 days, and require explicit creator opt-in before any Explore use.
- Explore contains free curated templates only. Coin-priced Premium Prompt Packs are deferred.
- LINE OA sends completion messages and accepts support handoffs with Generation Job ID/status.

## Non-goals

- Public sign-up, creator marketplace, paid Prompt Packs, follower/like feed.
- Video-to-Video, multi-image/start-end controls, and 2K controls in LIFF.
- Any browser-held secret or direct client call to BFL, SlipOK, R2, or Supabase secret APIs.
- Automatic refunds for a completed but disliked result.

## Critical reconciliation

The earlier `.scratch/ai-coach-vertical-slice/` plan is a local/demo proof. Tickets 03–05 there use simulated authentication and a Kling profile. Do not extend those assumptions into this pilot. Preserve useful seams/tests but replace Kling with the FLUX.3 Provider Profile, real LINE identity, no fixed Grill-question limit, and a real Generation Job lifecycle.

## References

- Domain terms: `CONTEXT.md`
- Customer-pilot decisions: `docs/adr/0024-*` through `docs/adr/0031-*`
- Queue/realtime baseline: `docs/adr/0003-serverless-queue-and-realtime-generation-pipeline.md`
- Coin lifecycle: `docs/adr/0001-*`, `0002-*`, `0011-*`, `0027-*`
- Prompt pipeline: `docs/ai-coach-prompt-pipeline.md` (adapt its old provider/question-limit assumptions)
- Existing frontend prototypes: `public/full-ui-preview.html`, `public/liff-prototype.html`

## Blocking configuration status (2026-08-24)

Configured locally without recording values: BFL API key; Supabase URL/publishable/secret keys; Cloudflare account/API/R2 access keys/public URL; PromptPay recipient; SlipOK API key and branch ID.

Still required before a live integration: public application URL; LIFF ID; LINE Login and Messaging credentials; R2 bucket name; SlipOK webhook secret; queue credentials; pilot admin identities; and the OpenAI API key required by ADR 0017 for the production Prompt Engine. Confirm the FLUX.3 endpoints/features enabled for the BFL account and select Coin prices from actual BFL costs before enabling payment.

## Verification bar

- Use behavioral tests through workflow/service seams, with provider, queue, wallet, and notification adapters faked in unit tests.
- Run all existing tests and typecheck after each ticket.
- Exercise the live integration only from an allowlisted test LINE account and with a deliberately capped BFL budget.
- Do not log, return, commit, or display environment-secret values.
