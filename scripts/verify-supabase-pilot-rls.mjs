import { randomBytes } from "node:crypto";

import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const silentLogger = { error() {} };
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", silentLogger);

const requiredNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
];

const missing = requiredNames.filter((name) => !process.env[name]?.trim());
if (missing.length > 0) {
  console.error("Supabase RLS verification cannot run; missing configuration names:");
  for (const name of missing) console.error(`- ${name}`);
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const runId = `rls-${Date.now()}-${randomBytes(6).toString("hex")}`;
const password = randomBytes(24).toString("base64url");
const testUsers = [];
const created = {};
let currentStep = "initializing";

function fail(message) {
  throw new Error(message);
}

async function request(path, { method = "GET", body, token = secretKey, prefer } = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      apikey: token === secretKey ? secretKey : publishableKey,
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) fail(`request to ${path} returned HTTP ${response.status}`);
  const payload = await response.text();
  return payload ? JSON.parse(payload) : null;
}

async function createTestUser(label) {
  const email = `${runId}-${label}@example.invalid`;
  const response = await request("/auth/v1/admin/users", {
    method: "POST",
    body: { email, password, email_confirm: true },
  });
  const user = response.user ?? response;
  if (!user?.id) fail("Supabase did not return a test user id");
  testUsers.push(user.id);

  const session = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
    token: publishableKey,
  });
  if (!session?.access_token) fail("Supabase did not issue a test user session");
  return { id: user.id, accessToken: session.access_token };
}

async function insert(table, body) {
  const rows = await request(`/rest/v1/${table}?select=id`, {
    method: "POST",
    body,
    prefer: "return=representation",
  });
  if (!Array.isArray(rows) || rows.length !== 1 || !rows[0].id) {
    fail(`could not create ${table} test fixture`);
  }
  return rows[0].id;
}

async function selectAs(token, table, id, key = "id") {
  return request(`/rest/v1/${table}?${key}=eq.${encodeURIComponent(id)}&select=${key}`, { token });
}

async function assertVisibleToOwner(owner, table, id, key) {
  const rows = await selectAs(owner.accessToken, table, id, key);
  if (!Array.isArray(rows) || rows.length !== 1) {
    fail(`owner cannot read own ${table} fixture`);
  }
}

async function assertHiddenFromOtherUser(otherUser, table, id, key) {
  const rows = await selectAs(otherUser.accessToken, table, id, key);
  if (!Array.isArray(rows) || rows.length !== 0) {
    fail(`cross-owner read was allowed for ${table}`);
  }
}

async function assertMutationDenied(otherUser, table, id, body, key = "id") {
  const rows = await request(`/rest/v1/${table}?${key}=eq.${encodeURIComponent(id)}&select=${key}`, {
    method: "PATCH",
    body,
    token: otherUser.accessToken,
    prefer: "return=representation",
  });
  if (!Array.isArray(rows) || rows.length !== 0) {
    fail(`cross-owner mutation was allowed for ${table}`);
  }
}

async function deleteWhere(table, filter) {
  try {
    await request(`/rest/v1/${table}?${filter}`, { method: "DELETE" });
  } catch {
    // Cleanup must not hide the original verification result. The unique run id
    // allows an operator to identify any residual test records safely.
  }
}

async function cleanup() {
  if (created.feedbackId) await deleteWhere("generation_feedback", `id=eq.${created.feedbackId}`);
  if (created.resultAssetId) await deleteWhere("result_assets", `id=eq.${created.resultAssetId}`);
  if (created.jobId) await deleteWhere("generation_jobs", `id=eq.${created.jobId}`);
  if (created.sourceAssetId) await deleteWhere("source_assets", `id=eq.${created.sourceAssetId}`);
  if (created.walletOwnerId) await deleteWhere("wallets", `owner_id=eq.${created.walletOwnerId}`);
  if (created.briefId) await deleteWhere("confirmed_creative_briefs", `id=eq.${created.briefId}`);

  for (const userId of testUsers.reverse()) {
    try {
      await request(`/auth/v1/admin/users/${userId}`, { method: "DELETE" });
    } catch {
      // See cleanup note above.
    }
  }
}

try {
  currentStep = "creating two temporary test identities";
  const firstUser = await createTestUser("a");
  const secondUser = await createTestUser("b");

  currentStep = "creating second-user fixtures";
  created.briefId = await insert("confirmed_creative_briefs", {
    owner_id: secondUser.id,
    creative_brief: { idea: "RLS verification fixture", confirmed: true },
  });
  created.walletOwnerId = secondUser.id;
  await request("/rest/v1/wallets", {
    method: "POST",
    body: { owner_id: secondUser.id, coin_balance: 10 },
  });
  created.sourceAssetId = await insert("source_assets", {
    owner_id: secondUser.id,
    storage_key: `${runId}/source.jpg`,
    media_type: "image/jpeg",
    byte_size: 1,
  });
  created.jobId = await insert("generation_jobs", {
    owner_id: secondUser.id,
    creative_brief_id: created.briefId,
    source_mode: "text_to_video",
    tier: "economy",
    state: "completed",
  });
  const [job] = await request(`/rest/v1/generation_jobs?id=eq.${created.jobId}&select=expires_at`);
  if (!job?.expires_at) fail("completed Generation Job has no expiry timestamp");
  created.resultAssetId = await insert("result_assets", {
    owner_id: secondUser.id,
    generation_job_id: created.jobId,
    storage_key: `${runId}/result.mp4`,
    media_type: "video/mp4",
    byte_size: 1,
    expires_at: job.expires_at,
  });
  created.feedbackId = await insert("generation_feedback", {
    owner_id: secondUser.id,
    generation_job_id: created.jobId,
    sentiment: "ตรงใจ",
  });
  const fixtures = [
    ["confirmed_creative_briefs", created.briefId, "id"],
    ["wallets", secondUser.id, "owner_id"],
    ["source_assets", created.sourceAssetId, "id"],
    ["generation_jobs", created.jobId, "id"],
    ["result_assets", created.resultAssetId, "id"],
    ["generation_feedback", created.feedbackId, "id"],
  ];

  currentStep = "checking owner reads and cross-owner read isolation";
  for (const [table, id, key] of fixtures) {
    await assertVisibleToOwner(secondUser, table, id, key);
    await assertHiddenFromOtherUser(firstUser, table, id, key);
  }

  currentStep = "checking cross-owner mutation isolation";
  await assertMutationDenied(firstUser, "confirmed_creative_briefs", created.briefId, {
    creative_brief: { tampered: true },
  });
  await assertMutationDenied(firstUser, "wallets", secondUser.id, { coin_balance: 999 }, "owner_id");
  await assertMutationDenied(firstUser, "source_assets", created.sourceAssetId, { deleted_at: new Date().toISOString() });
  await assertMutationDenied(firstUser, "generation_jobs", created.jobId, { state: "failed" });
  await assertMutationDenied(firstUser, "generation_feedback", created.feedbackId, { reason: "tampered" });

  console.log("Supabase two-identity RLS verification passed. Test identities and fixtures were removed.");
} catch (error) {
  const reason = error instanceof Error ? error.message : "unknown error";
  console.error(`Supabase two-identity RLS verification failed during ${currentStep}: ${reason}`);
  console.error("No secrets or response bodies were displayed.");
  process.exitCode = 1;
} finally {
  await cleanup();
}
