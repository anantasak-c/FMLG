# Single-provider Prompt Engine for MVP

For the AI Coach MVP, both the Adaptive Grill and Prompt Package compiler run through one OpenAI Responses API adapter behind the Prompt Engine port. The port has a deterministic fake implementation for tests, keeps provider-specific code out of the domain flow, and permits an Anthropic adapter later; this deliberately supersedes the prior two-provider decision to reduce credentials, latency, and operational failure modes before the product behaviour is proven.
