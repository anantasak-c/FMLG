# 05: Hand Off to Studio Draft and Manage Lifecycle

**What to build:** An authenticated user can open an editable Studio Draft from a Prompt Package, manage exported work in their workspace, and remove old work without unintended generation or billing.

**Blocked by:** 04: Compile a Knowledge-Grounded Prompt Package.

**Status:** ready-for-agent

- [ ] A Prompt Package creates a prefilled Studio Draft that the user can edit independently without changing the immutable package.
- [ ] Creating, opening, and editing a Studio Draft creates no Generation Job, provider call, Wallet mutation, or Coin charge.
- [ ] A user can soft-delete a Prompt Package; normal workspace views then hide the package and its linked Studio Draft while records remain recoverable/auditable.
- [ ] Workspace views expose only the current user's visible Prompt Packages and Studio Drafts.
- [ ] Automated behavioral tests cover handoff, independent Draft editing, no-billing/no-generation behavior, soft deletion, and ownership-scoped workspace views.
