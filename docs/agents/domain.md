# Domain docs

## Before exploring

Read the root `CONTEXT.md` and the ADRs in `docs/adr/` that affect the work. If either is absent, proceed silently.

## Layout

This is a single-context repository:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Consumer rules

Use the canonical terms defined in `CONTEXT.md` when naming domain concepts. If a proposed decision contradicts an ADR, surface the conflict explicitly rather than silently overriding it. Add new glossary language and ADRs only through the domain-modeling flow when a term or hard-to-reverse trade-off is actually resolved.
