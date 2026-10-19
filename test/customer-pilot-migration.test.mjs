import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/202608240001_customer_pilot_core.sql",
  import.meta.url,
);

async function migration() {
  return readFile(migrationPath, "utf8");
}

test("customer-pilot migration keeps Generation Jobs private with a 15-day result lifecycle", async () => {
  const sql = await migration();

  assert.match(sql, /create table public\.generation_jobs/i);
  assert.match(sql, /state public\.generation_job_state/i);
  assert.match(sql, /'pending', 'processing', 'completed', 'failed', 'refunded', 'expired'/i);
  assert.match(sql, /is_private boolean not null default true/i);
  assert.match(sql, /expires_at := new\.completed_at \+ interval '15 days'/i);
  assert.match(sql, /result asset owner and expiry must match its generation job/i);
});

test("customer-pilot migration makes credits unique and ledger entries immutable", async () => {
  const sql = await migration();

  assert.match(sql, /allowlist_id uuid not null unique/i);
  assert.match(sql, /owner_id uuid not null unique references auth\.users/i);
  assert.match(sql, /idempotency_key text not null unique/i);
  assert.match(sql, /before update or delete on public\.coin_ledger_entries/i);
  assert.match(sql, /coin ledger entries are immutable/i);
});

test("customer-pilot migration enables owner-scoped RLS on every owned resource", async () => {
  const sql = await migration();

  for (const table of [
    "wallets",
    "coin_ledger_entries",
    "source_assets",
    "generation_jobs",
    "result_assets",
    "generation_feedback",
    "input_rights_confirmations",
    "notification_deliveries",
    "prompt_packages",
    "studio_drafts",
  ]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
  }

  assert.match(sql, /Owners can view their Generation Jobs/i);
  assert.match(sql, /using \(\(select auth\.uid\(\)\) = owner_id\)/i);
});

test("two-identity verifier covers every ticket-02 owner resource without logging secrets", async () => {
  const verifier = await readFile(
    new URL("../scripts/verify-supabase-pilot-rls.mjs", import.meta.url),
    "utf8",
  );

  for (const table of [
    "confirmed_creative_briefs",
    "wallets",
    "source_assets",
    "generation_jobs",
    "result_assets",
    "generation_feedback",
  ]) {
    assert.match(verifier, new RegExp(`\"${table}\"`, "i"));
  }

  assert.match(verifier, /No secrets or response bodies were displayed/i);
});

test("AI Coach consent is versioned and owner-scoped before a live provider request", async () => {
  const sql = await readFile(
    new URL("../supabase/migrations/202608240003_ai_coach_consents.sql", import.meta.url),
    "utf8",
  );
  assert.match(sql, /create table public\.ai_coach_consents/i);
  assert.match(sql, /unique \(owner_id, policy_version\)/i);
  assert.match(sql, /alter table public\.ai_coach_consents enable row level security/i);
  assert.match(sql, /Owners can create their AI Coach consents/i);
});
