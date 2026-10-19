# Direct Provider API Integration Strategy

## Context
Video generation can be routed through multi-model aggregators (e.g., Fal.ai, Replicate) or connected directly to upstream AI model providers (Kling AI, Minimax/Hailuo, Black Forest Labs, etc.).

## Decision
We connect directly to upstream provider APIs with modular adapters for each provider.

## Rationale
- Minimizes raw per-generation API costs and eliminates aggregator markup fees.
- Provides direct access to native provider features, parameters, and early API updates.
- Enables granular cost tracking and precise Coin margin calculations per model.
