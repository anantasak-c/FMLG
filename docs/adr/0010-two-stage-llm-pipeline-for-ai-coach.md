---
status: superseded by ADR-0017
---

# Two-Stage LLM Architecture for AI Coach

## Context
AI Coach requires conversational agility for free Thai interactive interviewing and high-precision cinematic prompt engineering when exporting final prompts.

## Decision
We implement a two-stage LLM pipeline:
1. **Interactive Interview Stage**: Powered by OpenAI GPT-4o-mini for cost-effective, low-latency, conversational question-asking and Thai nuance comprehension.
2. **Cinematic Synthesis Stage**: Powered by Anthropic Claude 3.5 Sonnet to compile the interview brief into high-fidelity, model-specific English prompts, camera movements, and multi-shot storyboards.

## Rationale
- Keeps operational overhead near zero for free interactive conversations.
- Delivers industry-leading cinematic prompt accuracy and model tag alignment for paid export actions.

> Superseded: MVP now uses one OpenAI Responses API provider behind the Prompt Engine port. See ADR-0017.
