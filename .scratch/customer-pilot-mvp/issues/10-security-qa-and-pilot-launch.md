# 10: Security, QA, and controlled pilot launch

Type: task
Status: ready-for-agent
Blocked by: 05: FLUX.3 generation service and asset lifecycle; 06: Coin top-up and SlipOK verification; 07: LIFF first-generation journey; 08: Web advanced Studio and free Explore; 09: LINE notifications, support, and observability

## Work

- Test RLS, allowlist, secret isolation, duplicate-payment resistance, debit/refund idempotency, signed downloads, 15-day cleanup, and content-consent UI.
- Perform live smoke tests from one allowlisted LINE account under an explicit BFL spending cap.
- Verify Vercel production environment variables are set without printing them and configure LINE endpoint/webhook URLs.
- Produce a short operator runbook: add/remove allowlist account, grant/inspect Pilot Credit, investigate failed job, retry notification, and respond to support handoff.

## Acceptance criteria

- All automated tests, typecheck, and production build pass.
- One invited user can complete the full journey and support can resolve a forced failure without manual database editing.
- No secrets appear in source, logs, client bundles, test output, or the repository.
