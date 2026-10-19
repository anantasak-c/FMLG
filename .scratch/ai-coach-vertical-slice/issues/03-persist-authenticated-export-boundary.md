# 03: Persist an Authenticated Export Boundary

**What to build:** A confirmed Guest Coach Session can cross a simulated sign-in boundary and become a user-owned, durable Confirmed Creative Brief while preserving strict ownership between users.

**Blocked by:** 02: Run the Adaptive Grill.

**Status:** ready-for-agent

- [ ] Simulated sign-in carries the current confirmed Creative Brief into the authenticated export flow without losing user input.
- [ ] The system persists a user-owned Confirmed Creative Brief in Supabase without creating a Prompt Package or Studio Draft early.
- [ ] Row Level Security prevents one simulated user from reading, changing, or deleting another user's Confirmed Creative Brief.
- [ ] The workflow returns user-visible failure state without leaving a partial Confirmed Creative Brief when persistence fails.
- [ ] Automated behavioral tests cover the boundary transition, persistence, isolation, and persistence failure.
