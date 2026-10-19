# 30-Day Automated Video Retention and Purge Policy

Status: superseded by ADR-0028

## Context
User-generated AI videos incur persistent storage volume costs on Cloudflare R2 if kept indefinitely.

## Decision
All user-generated videos are subject to a strict 30-day lifecycle retention policy. After 30 days from creation, files stored in Cloudflare R2 and their associated storage URLs are purged automatically via an R2 lifecycle rule or scheduled maintenance worker.

## Rationale
- Strictly bounds cloud storage expenditure regardless of user base growth.
- Prompts users to download their assets promptly upon creation.
- Keeps database and storage footprint clean and lean.
