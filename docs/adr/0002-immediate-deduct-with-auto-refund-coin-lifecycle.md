# Immediate Deduct with Auto-Refund Coin Lifecycle

## Context
Video generation is an asynchronous, multi-minute operation with non-zero failure and timeout rates from third-party AI providers. We needed a reliable strategy to prevent balance exploits while maintaining user trust.

## Decision
We deduct Coins immediately upon generation request creation and record an immutable ledger entry. If the background generation job encounters an irrecoverable provider error or timeout, the system automatically creates a `refund` ledger entry and returns the Coins to the user's wallet.

## Rationale
- Prevents concurrent generation race conditions where a user tries to generate multiple expensive videos simultaneously with insufficient balance.
- Provides a clear, auditable transaction log of every spend and refund.
