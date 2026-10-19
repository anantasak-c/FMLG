# Guest AI Coach and Authenticated Export

## Context

Requiring an account before a visitor can explore the AI Coach adds friction. Conversely, Prompt Packages and Studio Drafts are durable account resources and future exports consume Coins.

## Decision

Visitors may use a Guest Coach Session to complete the Adaptive Grill AI interview. Its structured creative brief is held in browser session state only. Exporting a Prompt Package, creating a Studio Draft, or performing a billable action requires authentication. On successful authentication, the guest's current structured creative brief is carried into the authenticated export flow.

The first local/demo slice simulates this authenticated identity and transition. Production Supabase Auth is introduced later according to ADR 0007.

## Rationale

- Lets visitors experience the platform's differentiating interview before committing to sign in.
- Prevents unauthenticated ownership, server-side temporary-data, Wallet, and retention-policy edge cases.
- Preserves the user's work at the conversion boundary instead of asking them to repeat the interview.
