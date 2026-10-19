# AI Coach to Studio Draft Handoff

## Context

The AI Coach vertical slice exports a Prompt Package. Users need a direct path from this planning result to Video Studio without accidental provider costs or an irreversible Generation Job.

## Decision

AI Coach may create a Studio Draft that pre-populates editable Video Studio settings from the Prompt Package. Creating or opening a Studio Draft is non-billable and never starts a Generation Job. Generation remains an explicit Video Studio action.

## Rationale

- Preserves the user's control over model-specific settings before spending Coins.
- Makes the Coach-to-Studio transition useful in the first vertical slice without coupling it to provider execution.
- Keeps the Coin deduction and automatic refund lifecycle in ADR 0002 scoped to actual Generation Jobs.
