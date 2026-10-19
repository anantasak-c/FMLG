# 04: Compile a Knowledge-Grounded Prompt Package

**What to build:** An authenticated user can export a confirmed Creative Brief into an immutable, Kling-oriented Prompt Package grounded in tagged, versioned video-prompt knowledge.

**Blocked by:** 03: Persist an Authenticated Export Boundary.

**Status:** ready-for-agent

- [ ] The internal knowledge base is versioned, split into human-readable tagged sections, and retrieved deterministically within a bounded context budget.
- [ ] The deterministic compiler returns an English final prompt, risk-specific negative prompt, Thai review artifacts, assumptions, and retrieval provenance.
- [ ] The quality gate blocks contradictory anchors, timeline mismatch, policy/safety violations, and impossible dialogue timing.
- [ ] Warnings may be explicitly overridden with Export anyway and retain their quality-gate result in the Prompt Package.
- [ ] Every export creates a distinct immutable Prompt Package with its selected knowledge-section identifiers and knowledge-base version.
- [ ] Automated behavioral tests cover relevant/irrelevant retrieval, output shape, warnings, all blocking outcomes, override, and repeat export versioning.
