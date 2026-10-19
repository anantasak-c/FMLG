# Prompt Package Versioning and Deletion

## Context

Prompt Packages carry the compiled output, selected knowledge sections, and quality-gate result that explain an export. Users still need to revise a Creative Brief and clear old work from their workspace.

## Decision

Each export creates a new immutable Prompt Package; it never overwrites a prior export. Users may soft-delete a Prompt Package. Its linked Studio Draft is then hidden from normal workspace views but the underlying records remain available for audit and recovery.

## Rationale

- Preserves retrieval provenance and future Coin-charge history for every export.
- Lets users iterate without losing a prior usable prompt.
- Avoids hard-delete cascades while providing a clean workspace experience.
