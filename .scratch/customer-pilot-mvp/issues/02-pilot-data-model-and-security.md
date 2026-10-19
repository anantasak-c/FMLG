# 02: Pilot data model, ownership, and security

Type: task
Status: resolved
Blocked by: 01: Repository and live configuration preflight

## Work

- Add Supabase migrations for LINE-linked users, pilot allowlist, Pilot Credit grant, Wallet, immutable Coin ledger, Generation Job, source assets, result assets, feedback, consent, and notification delivery records.
- Enable RLS on every user-owned table and write owner-scoped policies.
- Encode the Generation Job states: pending, processing, completed, failed, refunded, expired.
- Make created videos private by default and add a 15-day expiry timestamp.
- Preserve existing Confirmed Creative Brief / Prompt Package / Studio Draft migrations and reconcile naming without breaking existing tests.

## Acceptance criteria

- Two authenticated test identities cannot read or mutate one another's creative assets, Wallet, jobs, or feedback.
- Ledger entries are append-only and one Pilot Credit can be granted only once per allowlisted account.
- A completed result has an expiry timestamp exactly 15 days after completion.

## Comments

- 2026-08-24: Claimed after Ticket 01 resolved. Designing an additive migration that preserves the existing Confirmed Creative Brief, Prompt Package, and Studio Draft tables while adding closed-pilot ownership, Wallet, and private Generation Job lifecycle controls.
- 2026-08-24: Added additive migration `202608240001_customer_pilot_core.sql`. It introduces LINE-linked identities and allowlist, one-time Pilot Credit records, Wallets and immutable Coin ledger entries, source/result assets, private Generation Jobs, feedback, consent, notification deliveries, Prompt Packages, and Studio Drafts. All user-owned tables have RLS; privileged browser mutations are denied by the absence of write policies.
- 2026-08-24: Added migration regression tests covering RLS declarations, Pilot Credit/ledger uniqueness, append-only ledger triggers, and exact 15-day completed-result expiry. `npm test` and Windows-compatible TypeScript typecheck pass. The repository has no Supabase CLI or PostgreSQL client, and no remote database migration was applied; live two-identity RLS verification remains required before this ticket can resolve.
- 2026-08-24: Preflight confirmed there is no Supabase access token, database connection string, Supabase CLI, PostgreSQL client, or running local Docker daemon. The remaining safe path is for an operator to run `supabase/migrations/202608240001_customer_pilot_core.sql` in the target project's Supabase SQL Editor (or provide an approved migration channel), then return for live two-identity RLS verification. No database state was changed.
- 2026-08-24: Operator applied the prerequisite and customer-pilot migrations in Supabase SQL Editor. `npm run supabase:verify-rls` then passed against the live project: two temporary authenticated identities confirmed owner reads and denied all cross-owner reads/mutations for Confirmed Creative Briefs, Wallets, source/result assets, Generation Jobs, and feedback. Fixtures and test identities were deleted after verification; values, tokens, and response bodies were not logged.
