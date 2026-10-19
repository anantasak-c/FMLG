# 05: Economy Video Engine generation service and asset lifecycle

Type: task
Status: ready-for-agent
Blocked by: Economy Video Engine endpoint verification; R2 bucket

## Work

- Confirm the currently enabled Runpod/ComfyUI Economy Video Engine request schema before implementation or live requests.
- Implement the server-side Economy Video Engine adapter behind the Model Router. High Quality and post-result 2K Upscale remain future Skill Registry entries.
- Submit async Generation Jobs through the chosen queue, poll/webhook safely, persist authoritative state in Supabase, and store resulting media in the dedicated R2 bucket.
- Enforce one Economy Pilot Credit, immediate Wallet debit for paid work, and automatic refund only for irrecoverable failure.
- Create signed download URLs and lifecycle cleanup for 15-day private results.

## Acceptance criteria

- A capped test account completes one real Economy job end-to-end without exposing Economy Video Engine credentials.
- A failed provider job results in exactly one refund ledger entry; a successful disliked job does not refund.
- 2K Upscale requires a completed source video and cannot be started from LIFF.
