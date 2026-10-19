# Separated Storage for Course Content vs User Generations

## Context
We host both high-value educational course videos and on-demand user-generated video outputs.

## Decision
We separate video storage infrastructure into two distinct tiers:
1. **Course Video Streaming**: Hosted on a dedicated streaming service (e.g., Cloudflare Stream / Bunny.net Stream) with HLS adaptive bitrate, token-authenticated access, and player download restrictions.
2. **User Generations**: Stored in Cloudflare R2 bucket with direct presigned download/preview URLs and zero egress fees.

## Rationale
- Protects commercial course intellectual property against unauthorized ripping.
- Delivers optimal mobile playback streaming experience for course lessons.
- Minimizes bandwidth egress costs for heavy user generation asset previews and downloads.
