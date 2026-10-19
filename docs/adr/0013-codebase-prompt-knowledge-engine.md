# Codebase Prompt Knowledge, Retrieval & Template Engine

## Context
AI Coach requires domain knowledge about cinematic framing, camera motions, and model-specific prompt structures to translate user intent into production-grade prompts.

## Decision
We store prompt knowledge, camera dictionaries, model formatting templates, and a versioned Thai video-prompt knowledge base within `src/config/prompts/` rather than database tables for MVP.

The AI Coach pipeline has a deliberate boundary between conversation and generation. For the first vertical slice, retrieval is deterministic tag filtering over versioned Markdown sections; semantic/vector ranking is explicitly deferred until evaluation shows that the tag taxonomy cannot retrieve relevant guidance.

```text
User brief / form
  -> Adaptive Grill AI
  -> structured creative brief (JSON)
  -> tagged knowledge-base retrieval
  -> prompt compiler
  -> final prompt + negative prompt + checklist
```

The interview stage may ask only one to three highest-impact questions per turn. It must persist the user's confirmed answers in the structured brief, rather than embedding the whole chat transcript in the export request. At export time, the compiler receives the normalized brief plus only the relevant tagged knowledge slices.

The compiler produces a deterministic output envelope: an English generation prompt, a risk-specific negative prompt, an optional Thai dialogue sheet, a continuity checklist, unresolved assumptions, and a preflight quality-gate result. The final prompt is not emitted if the quality gate finds contradictory anchors, an impossible timeline, or a known policy/safety violation; incomplete optional boundaries remain explicit assumptions.

## Rationale
- Zero latency in runtime retrieval with typed interfaces.
- Tracked, reviewed, and versioned directly alongside application code via Git.
- Keeps knowledge injection narrow, inspectable, and resistant to irrelevant-context drift.
