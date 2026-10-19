# Serverless Background Queue with Supabase Realtime for Generation Pipeline

## Context
AI video generation takes anywhere from 30 seconds to several minutes, and different model providers use either webhooks or polling endpoints. A standard synchronous Next.js API request would time out.

## Decision
We adopt a hybrid pipeline:
1. **Background Job Runner (Inngest / QStash)** handles long-running provider polling, webhook retries, downloading video artifacts, and streaming them into Cloudflare R2.
2. **Supabase Database & Realtime WebSocket** maintains the authoritative generation state (`pending` -> `processing` -> `completed` / `failed`), pushing live status updates directly to the client UI.

## Rationale
- Serverless-friendly architecture without requiring dedicated Redis/Celery worker servers.
- Resilient against network drops and browser refreshes; the client always reconnects to the authoritative Supabase channel.
