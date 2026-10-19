# 06: Coin top-up and SlipOK verification

Type: task
Status: ready-for-agent
Blocked by: 02: Pilot data model, ownership, and security; Coin-package prices; SlipOK webhook secret

## Work

- Present approved Coin packages and generate a PromptPay QR without retaining sensitive payment data in the browser.
- Verify slips server-side using SlipOK, reject duplicate/replayed slips, and append immutable top-up ledger entries atomically.
- Preserve a selected generation intent when the user must top up for insufficient Coin.
- Add an internal, access-controlled reconciliation view and failure-safe webhook processing.

## Acceptance criteria

- One valid test slip credits Coin exactly once; retries and duplicates never double-credit.
- The UI clearly displays price, balance, and required Coin before any paid generation confirmation.
