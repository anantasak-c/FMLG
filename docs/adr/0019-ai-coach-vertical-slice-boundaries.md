# AI Coach Vertical Slice Boundaries

## Context

The AI Coach needs a runnable first slice before production provider credentials, Coin charging, and asynchronous video generation are introduced.

## Decision

The first vertical slice uses Next.js App Router and TypeScript with Supabase as its technical baseline. It exposes a single Kling Provider Profile. LLM and Wallet dependencies are behind server-side interfaces with deterministic test implementations; the slice makes no production model calls and mutates no Coin balance. It uses a simulated authenticated identity rather than a production Auth integration, but persists owned Prompt Packages and editable Studio Drafts in Supabase. Inngest and R2 are deferred because no Generation Job is created.

## Rationale

- Gives the creative-brief, retrieval, compiler, export, and Studio Draft flow a repeatable test surface.
- Keeps secrets and future production adapters out of browser code.
- Limits initial integration scope without constraining the Provider Profile interface or the existing Wallet decisions.
