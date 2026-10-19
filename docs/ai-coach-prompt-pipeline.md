# Skill Chat Runtime

## Purpose

The web AI Coach is a natural Thai-first chatbot. It does not require the model to produce a Creative Brief state, decision card, Prompt Package, JSON envelope, or fixed sequence of questions. A selected Skill supplies workflow knowledge only when it is useful.

LIFF and the legacy authenticated Creative Brief/Prompt Package modules remain separate boundaries and are not changed by this web chat.

## User flow

```text
Choose one Skill for a new chat
        ↓
Write a normal message
        ↓
Server loads the selected SKILL.md and references
        ↓
Ox Alpha streams a free-form Markdown reply
        ↓
Free router is used only if Ox fails before its first token
```

The initial catalog contains:

- `general`: no additional workflow; the assistant replies as a general creative collaborator.
- `create-flux3-video`: the complete FLUX.3 direction, interview, prompt, audit, and payload guidance.

The selected Skill is locked for the chat. Starting a new chat returns to the Skill picker.

## Runtime boundary

`POST /api/coach/chat` accepts the selected allowlisted Skill, explicit AI-provider consent, the latest user message, and up to 24 prior `user`/`assistant` messages. Browser-supplied `system` roles are rejected. The server reads Skill files and OpenRouter credentials; neither is exposed to the client.

The response is a UTF-8 text stream. The client renders Markdown without enabling raw HTML, supports aborting an active stream, retains a partial stopped response, and offers retry after a stream error. Chat session v2 stores only `skillId`, consent, messages, and timestamps in local storage. Version 1 web Coach sessions migrate their transcript to the FLUX.3 Skill and discard Creative Brief/Prompt Package state.

The web runtime can write or audit FLUX.3 prompts and payloads but cannot currently call BFL, spend credits, poll a generation job, or download media. It must state that limitation when execution is requested and must never pretend an external action ran.

## Model behavior

The model answers in the user's language and may use headings, lists, tables, code blocks, or JSON when useful. No application-level schema, repair pass, deterministic recovery question, fixed question count, or provider router is imposed.

The selected Skill remains responsible for its own interview method and quality checks. In particular, FLUX.3 may ask one decision-changing question at a time when essential information is missing, or proceed immediately when the request is already executable.

## Verification

Tests cover Skill allowlisting, conversation-role preservation, secret isolation, raw Markdown streaming, Ox-to-free fallback before the first token, session locking, and version 1 migration. Production verification also covers Skill selection, Markdown rendering, Stop, partial-response retention, and local-storage restoration after reload.
