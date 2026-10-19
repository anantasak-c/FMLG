# 09: LINE notifications, support, and observability

Type: task
Status: ready-for-agent
Blocked by: 03: LINE identity, allowlist, and LIFF shell; 05: FLUX.3 generation service and asset lifecycle

## Work

- Send a LINE OA completion message containing a deep link to My Work after a job completes or fails.
- Add LIFF help handoff to the OA chat containing a job reference/status but no secret or raw provider error.
- Record delivery attempts and retries, and instrument First Generation Success funnel events.

## Acceptance criteria

- Closing LIFF does not prevent a creator from receiving a completion link.
- Support can locate a job using the attached reference without seeing another user's content.
