# 03: LINE identity, allowlist, and LIFF shell

Type: task
Status: claimed
Blocked by: 01: Repository and live configuration preflight; 02: Pilot data model, ownership, and security

## Work

- Integrate LIFF initialization and server-side verification of LINE identity; never trust a browser-submitted user ID.
- Link LINE identity to Supabase user identity and enforce the Pilot Allowlist before granting Pilot Credit or creating jobs.
- Implement the LIFF app shell with Explore, Coach, My Work, and Me; show a plain-language waiting state for non-allowlisted users.
- Add first-generation Input Rights Confirmation and lightweight later-media reminder.
- Keep provider terminology hidden from LIFF users.

## Acceptance criteria

- An allowlisted LINE test account can authenticate and receives exactly one Economy Pilot Credit.
- A non-allowlisted account cannot create a job or spend Coin.
- LIFF behavior works on an HTTPS deployment and handles a user opening it outside LINE gracefully.

## Comments

- 2026-08-24: Claimed after Ticket 02 resolved. Implementing the server-side LINE identity verification and Pilot Allowlist boundary with fakes for tests; live LIFF verification remains gated on the missing LINE configuration and HTTPS preview deployment.
- 2026-08-24: Added server-side LINE ID-token verification, a testable Pilot Access port, server-only Supabase implementation, LIFF session/rights-confirmation routes, and the Thai-first `/liff` shell. The browser never submits a trusted LINE user ID: the server uses the `sub` returned by LINE's verification endpoint. Non-allowlisted identities receive a plain waiting state; eligible creators see the Explore, Coach, My Work, and Me shell plus first-generation Input Rights Confirmation.
- 2026-08-24: Added migration `202608240002_line_pilot_access.sql` for the transactional LINE identity/allowlist/Pilot Credit boundary. Unit tests, typecheck, and production build pass. This migration has not yet been applied, and live verification remains blocked on LIFF ID, LINE Login credentials, a configured allowlisted LINE test account, and an approved HTTPS preview deployment.
