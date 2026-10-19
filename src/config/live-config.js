/**
 * Names and shape checks for the configuration required to operate the closed
 * customer pilot. This module intentionally never returns environment values.
 */
export const LIVE_CONFIG_REQUIREMENTS = Object.freeze([
  { name: "NEXT_PUBLIC_APP_URL", requiresHttps: true },
  { name: "NEXT_PUBLIC_LIFF_REDIRECT_URL", requiresHttps: true },
  { name: "BFL_API_KEY" },
  { name: "NEXT_PUBLIC_LIFF_ID" },
  { name: "LINE_LOGIN_CHANNEL_ID" },
  { name: "LINE_LOGIN_CHANNEL_SECRET" },
  { name: "LINE_MESSAGING_CHANNEL_ACCESS_TOKEN" },
  { name: "LINE_MESSAGING_CHANNEL_SECRET" },
  { name: "LINE_OFFICIAL_ACCOUNT_ID" },
  { name: "NEXT_PUBLIC_SUPABASE_URL", requiresHttps: true },
  { name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" },
  { name: "SUPABASE_SECRET_KEY" },
  { name: "CLOUDFLARE_ACCOUNT_ID" },
  { name: "CLOUDFLARE_API_TOKEN" },
  { name: "CLOUDFLARE_R2_ACCESS_KEY_ID" },
  { name: "CLOUDFLARE_R2_SECRET_ACCESS_KEY" },
  { name: "CLOUDFLARE_R2_BUCKET" },
  { name: "CLOUDFLARE_R2_PUBLIC_URL", requiresHttps: true },
  { name: "PROMPTPAY_ID" },
  { name: "PROMPTPAY_ACCOUNT_NAME" },
  { name: "SLIPOK_API_KEY" },
  { name: "SLIPOK_BRANCH_ID" },
  { name: "SLIPOK_WEBHOOK_SECRET" },
  { name: "INNGEST_EVENT_KEY" },
  { name: "INNGEST_SIGNING_KEY" },
  { name: "PILOT_ADMIN_EMAILS" },
  { name: "PILOT_ADMIN_SECRET" },
  { name: "OPENROUTER_API_KEY" },
]);

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns configuration names only. Values are intentionally excluded so this
 * result is safe to log in a CLI, route handler, or deployment diagnostic.
 */
export function inspectLiveConfig(environment = process.env) {
  const missing = [];
  const invalid = [];

  for (const requirement of LIVE_CONFIG_REQUIREMENTS) {
    const value = environment[requirement.name];

    if (!hasValue(value)) {
      missing.push(requirement.name);
      continue;
    }

    if (requirement.requiresHttps && !isHttpsUrl(value)) {
      invalid.push(requirement.name);
    }
  }

  return Object.freeze({
    ok: missing.length === 0 && invalid.length === 0,
    missing: Object.freeze(missing),
    invalid: Object.freeze(invalid),
  });
}
