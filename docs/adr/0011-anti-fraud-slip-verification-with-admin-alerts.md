# Anti-Fraud Slip Verification with Realtime Admin Alerts

## Context
Bank slip upload workflows are vulnerable to duplicate slip replay attacks and forged slip images.

## Decision
We enforce a two-tier defense:
1. **Database Uniqueness**: A unique constraint index on the bank `transaction_ref` in the `payments` table. Re-uploading the same slip triggers an immediate database rejection.
2. **Instant Admin Alerts**: Successful top-ups and detected duplicate attempts trigger immediate Telegram/LINE webhook notifications to administrators with the slip metadata.

## Rationale
- 100% prevention of double-spending or replay attacks at the database layer.
- Realtime operational visibility for platform admins.
