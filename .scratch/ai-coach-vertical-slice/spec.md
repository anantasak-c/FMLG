Status: ready-for-agent

# AI Coach Vertical Slice Specification

## Problem Statement

Thai creators who want to generate video often begin with a vague idea and do not know prompt-engineering, model terminology, camera language, or which constraints must stay consistent. A generic chat response loses the user's decisions, injects irrelevant advice, and produces prompts that are difficult to review or move into Video Studio.

The product needs a low-friction, Thai-first path that turns an initial idea into a trustworthy, traceable Prompt Package. It must let a visitor explore the Adaptive Grill AI without an account, require an account before ownership or export, and hand the result to Video Studio without accidentally creating a Generation Job or spending Coins.

## Solution

Deliver an end-to-end AI Coach vertical slice built around one server-side **AI Coach Workflow** seam. A visitor begins with a short, plain-language intake form, then completes an Adaptive Grill AI conversation. The Workflow incrementally maintains a structured Creative Brief, asks no more than three high-impact questions per round, and summarizes locked decisions in Thai.

Before export, the user reviews and edits a Thai summary of the Creative Brief. The Workflow retrieves only relevant, human-tagged sections from the versioned video-prompt knowledge base, compiles a Kling-oriented Prompt Package, runs a quality gate, and records provenance. A warning can be explicitly overridden; a contradiction, impossible timeline, or policy/safety violation blocks export. Export creates an immutable Prompt Package and a linked, editable, non-billable Studio Draft. The Draft never creates a Generation Job.

The slice is local/demo-ready and uses deterministic LLM and Wallet adapters. It uses a simulated authenticated identity at the export boundary, while storing owned Prompt Packages and Studio Drafts in Supabase with Row Level Security. Production provider calls, Coin mutations, and production authentication are deliberately deferred.

## User Stories

1. As a Thai creator, I want to start from a short idea form, so that I do not need to understand prompt engineering before using AI Coach.
2. As a Thai creator, I want to state a duration, aspect ratio, reference asset, format/era, and safety boundary in plain language, so that the Grill AI starts with useful context.
3. As a Thai creator, I want technical provider and negative-constraint controls hidden by default, so that I am not overwhelmed by model jargon.
4. As a creator who needs control, I want to reveal advanced controls, so that I can override defaults when I understand the trade-off.
5. As a visitor, I want to use the Adaptive Grill AI before signing in, so that I can evaluate the product before creating an account.
6. As a visitor, I want the current Creative Brief retained during my browser session, so that I do not repeat answers while completing the interview.
7. As a visitor, I want my current Creative Brief to carry into the simulated sign-in flow, so that the export boundary does not discard my work.
8. As a creator, I want the Grill AI to ask only the one to three most important unanswered questions at a time, so that the interview remains conversational.
9. As a creator, I want the Grill AI to challenge vague language such as “cinematic,” so that I choose a concrete format and visual grammar.
10. As a creator, I want the Grill AI to flag too many events for the requested duration, so that the finished video has readable beats.
11. As a creator using culturally specific material, I want the Grill AI to ask for the desired level of cultural accuracy, so that the output does not collapse into generic visual shorthand.
12. As a creator, I want each interview round summarized in Thai with confirmed constraints, so that I can see what the system has locked.
13. As a creator, I want to review and edit the Thai Creative Brief summary before export, so that the compiler reflects my actual intent.
14. As a creator, I want the Prompt Package to include an English final generation prompt, so that it is suitable for the selected Kling Provider Profile.
15. As a creator, I want a negative prompt tailored to my brief's actual risks, so that it reduces genre drift, artifacts, camera violations, and unwanted text.
16. As a creator, I want an optional Thai dialogue sheet with timestamps and speakers, so that dialogue remains reviewable and usable.
17. As a creator, I want a Thai continuity checklist, so that I can preserve identity, costume, props, and spatial logic across future clips.
18. As a creator, I want explicit assumptions in the Prompt Package, so that the system never hides an unanswered decision.
19. As a creator, I want the quality gate to warn me about incomplete or risky choices, so that I can improve a brief without losing control.
20. As a creator, I want to choose “Export anyway” for warnings, so that acceptable creative risk does not block my work.
21. As a creator, I want export blocked when the brief has a contradiction, an impossible timeline, or a policy/safety violation, so that I do not receive a misleading Prompt Package.
22. As a creator, I want each export to create a separate immutable Prompt Package, so that I can compare iterations and retain retrieval provenance.
23. As a creator, I want a Studio Draft prefilled from my Prompt Package, so that I can continue into Video Studio without retyping the result.
24. As a creator, I want to edit the Studio Draft rather than overwrite the Prompt Package, so that the exported snapshot remains auditable.
25. As a creator, I want opening or editing a Studio Draft to be non-billable and non-generating, so that I cannot spend Coins accidentally.
26. As a creator, I want to soft-delete an old Prompt Package and hide its linked Studio Draft, so that my workspace stays manageable without erasing history immediately.
27. As a user, I want my Confirmed Creative Briefs, Prompt Packages, and Studio Drafts inaccessible to other users, so that my creative work remains private.
28. As a maintainer, I want each export to record the knowledge-base version and selected section identifiers, so that output can be reproduced and audited.
29. As a maintainer, I want the local/demo slice to use deterministic adapters, so that tests and demonstrations do not depend on credentials, variable model output, or Coin cost.
30. As a creator unfamiliar with technical tools, I want a light-first Thai interface with an optional dark toggle and clear primary actions, so that the workflow is easy to use.

## Implementation Decisions

- Use Next.js App Router and TypeScript as the application baseline, with Supabase for durable data.
- Build one server-side AI Coach Workflow as the highest application seam. It accepts workflow commands and returns the user-visible state; browser components, persistence, retrieval, compilation, and adapters are dependencies behind it.
- Model the workflow around a mutable Creative Brief, a durable Confirmed Creative Brief, an immutable Prompt Package, and an editable Studio Draft. A Confirmed Creative Brief crosses the authentication boundary and later compiles into a Prompt Package.
- Begin the flow with a short Thai intake form. Keep provider-specific and negative-constraint controls behind progressive disclosure. Use Kling as the sole initial Provider Profile.
- Treat the Guest Coach Session as browser-session state only. At export, carry its current Creative Brief across a simulated authentication transition; do not create a persistent resource before that boundary.
- Persist Confirmed Creative Briefs in Supabase at the authentication boundary. Apply Row Level Security to owner-scoped records and ensure a simulated user context is sufficient to exercise cross-user access tests. Prompt Packages and Studio Drafts are introduced by their downstream tickets.
- Give exported Prompt Packages immutable content and provenance: final prompt, negative prompt, optional dialogue sheet, continuity checklist, assumptions, quality-gate result, selected knowledge-section identifiers, and knowledge-base version.
- Version the internal Markdown knowledge base and split it into human-readable sections tagged by format, concern, culture, and production context. The retriever always includes the standard prompt structure and quality gate, then uses deterministic tag filtering under a bounded context budget. Semantic/vector search is out of scope.
- Implement the Adaptive Grill AI as an explicit question-selection policy over missing Creative Brief fields. It asks at most three questions per round and prioritizes promise, format/duration, inciting change, immutable anchors, readable action, camera/audio logic, prohibited content, and final success criterion.
- Require a confirmation/edit step after the Grill and before compilation. Compiler input is the confirmed brief, the selected Kling template, and retrieved knowledge only—not the raw chat transcript.
- Produce Thai-first review artifacts: a Thai Creative Brief summary, Thai dialogue sheet where relevant, and Thai checklist; preserve Thai dialogue and cultural terms verbatim inside the English final prompt where relevant.
- Make the quality gate return blocking failures and non-blocking warnings. Blocking failures are contradictory anchors, timeline mismatch, policy/safety violation, and dialogue that cannot fit its assigned time. Warnings support an explicit export override.
- Each export creates a new Prompt Package. Soft deletion hides the package and its linked Studio Draft from normal views while retaining records for audit/recovery.
- Populate a Studio Draft from the Prompt Package but make all subsequent Draft edits independent. Creating, opening, and editing a Draft does not start a Generation Job, call a video provider, or alter a Wallet.
- Keep LLM and Wallet ports server-side. Use deterministic test implementations in this slice; make no production LLM/video calls and no Coin mutations. Inngest, R2, and provider generation are deferred.
- Follow the platform's light-first, dual-theme visual decision with plain Thai labels, strong hierarchy, visible locked-brief summaries, and progressive disclosure. The design must be usable without model terminology.

## Testing Decisions

- Test externally observable behavior through the AI Coach Workflow seam, not internal prompts, component state, query order, or implementation details.
- Use deterministic LLM, Wallet, clock, identity, and knowledge-base fixtures so that a test's result is repeatable.
- Cover an end-to-end happy path from intake form state through guest interview, simulated sign-in, confirmation, retrieval, successful export, persisted Prompt Package, and prefilled Studio Draft.
- Cover question selection and the maximum of three questions per Adaptive Grill round, including a Thai locked-constraints summary.
- Cover deterministic tagged retrieval: relevant tags are selected, irrelevant sections are omitted, and knowledge-base version plus selected identifiers are recorded.
- Cover compiler output shape: English final prompt, risk-specific negative prompt, Thai review artifacts, assumptions, and quality-gate result.
- Cover quality-gate warnings and the explicit export override, plus all blocking conditions: contradictory anchors, timeline mismatch, policy/safety violation, and impossible dialogue timing.
- Cover the export lifecycle: a second export produces a distinct immutable Prompt Package and does not mutate the first.
- Cover Studio Draft handoff: it is prefilled, editable independently, and does not create a Generation Job or Wallet entry.
- Cover soft deletion: normal workspace queries omit the deleted Prompt Package and linked Draft while audit/recovery reads can still identify the records.
- Cover persistence ownership through Supabase Row Level Security using at least two simulated users; one user must not read, alter, delete, or access the Draft of another.
- Cover failure boundaries from persistence, retrieval, and deterministic adapters as user-visible workflow failures with no partial Prompt Package/Draft ownership state.
- There is no existing application test suite; establish the vertical-slice tests as the initial behavioral precedent.

## Out of Scope

- Production OpenAI, Anthropic, Kling, Minimax, BFL, or other provider calls.
- Production Wallet debit/refund, PromptPay, Slip Verification, or Coin charging.
- Production Google OAuth, LINE Login, or Email/Password authentication.
- Video generation, Generation Job creation, Inngest workflows, realtime status, Cloudflare R2 storage, and the 30-day video retention flow.
- Semantic/vector retrieval and automated re-tagging of the knowledge base.
- Multi-shot storyboard export, multi-provider profiles beyond Kling, and advanced provider parameter editing.
- Learn/Course capabilities, payments, and the rest of Video Studio beyond its non-generating Studio Draft handoff.

## Further Notes

- The first slice proves the differentiating creative workflow before production credentials or billing are introduced.
- Future production integration must preserve the immutable export history and existing Coin decisions: the free interview remains free, while paid export actions later use the Wallet lifecycle.
- This specification respects the existing decisions on PromptPay, Wallet lifecycle, two-stage LLM architecture, knowledge engine, authentication, and dual-theme UI. Where the slice uses simulation, it intentionally defers—not replaces—those production decisions.
