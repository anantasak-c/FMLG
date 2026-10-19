# PromptPay Payment via Slip Verification API

## Context
Payment via PromptPay is essential for Thai users. We considered full payment gateways (Opn/Omise, Stripe TH) versus Bank Slip Verification APIs (SlipOK / EasySlip API).

## Decision
We chose the Bank Slip Verification API approach for MVP. Users transfer via PromptPay QR and upload their transfer slip. The system validates the slip with the bank network via API and credits Coins instantly upon confirmation.

## Rationale
- Minimal transaction fee per top-up compared to percentage-based gateway charges.
- Low barrier to entry for Thai bank account integration without complex corporate merchant onboarding.
- High familiarity for Thai consumers with slip-upload workflows.
