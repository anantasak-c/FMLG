import "server-only";

import { createHash, randomBytes } from "node:crypto";

type SupabaseAccessResult = {
  is_allowlisted: boolean;
  has_pilot_credit: boolean;
  pilot_credit_granted: boolean;
};

type SupabaseUser = { id: string };

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server configuration: ${name}`);
  return value;
}

function configuration() {
  return {
    url: requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    secretKey: requiredEnvironment("SUPABASE_SECRET_KEY"),
  };
}

async function parseJson(response: Response) {
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

export function createSupabasePilotAccessRepository() {
  const { url, secretKey } = configuration();

  async function serviceRequest(path: string, init: RequestInit = {}) {
    const response = await fetch(`${url}${path}`, {
      ...init,
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) throw new Error(`Supabase server request failed: ${response.status}`);
    return parseJson(response);
  }

  async function findLinkedUserId(lineUserId: string): Promise<string | null> {
    const rows = (await serviceRequest(
      `/rest/v1/line_identities?line_user_id=eq.${encodeURIComponent(lineUserId)}&select=user_id`,
    )) as Array<{ user_id: string }>;
    return rows?.[0]?.user_id ?? null;
  }

  async function createLinkedUser(lineUserId: string): Promise<string> {
    const hash = createHash("sha256").update(lineUserId).digest("hex");
    const response = (await serviceRequest("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: `line-${hash}@identity.fomology.invalid`,
        password: randomBytes(32).toString("base64url"),
        email_confirm: true,
        app_metadata: { provider: "line" },
      }),
    })) as SupabaseUser | { user: SupabaseUser };
    const user = "user" in response ? response.user : response;
    if (!user?.id) throw new Error("Supabase did not return a linked user");
    return user.id;
  }

  return {
    async claimForVerifiedLineIdentity({ lineUserId }: { lineUserId: string }) {
      let ownerId = await findLinkedUserId(lineUserId);
      if (!ownerId) {
        try {
          ownerId = await createLinkedUser(lineUserId);
        } catch {
          ownerId = await findLinkedUserId(lineUserId);
          if (!ownerId) throw new Error("Could not establish LINE-linked account");
        }
      }

      const result = (await serviceRequest("/rest/v1/rpc/claim_line_pilot_access", {
        method: "POST",
        body: JSON.stringify({ p_line_user_id: lineUserId, p_owner_id: ownerId }),
      })) as SupabaseAccessResult[];
      const access = result?.[0];
      if (!access) throw new Error("Pilot access result was empty");

      return {
        isAllowlisted: access.is_allowlisted,
        hasPilotCredit: access.has_pilot_credit,
        pilotCreditGranted: access.pilot_credit_granted,
        ownerId,
      };
    },

    async recordInitialRightsConfirmation({ lineUserId }: { lineUserId: string }) {
      const ownerId = await findLinkedUserId(lineUserId);
      if (!ownerId) throw new Error("LINE-linked account does not exist");

      const access = await this.claimForVerifiedLineIdentity({ lineUserId });
      if (!access.isAllowlisted) throw new Error("Pilot access is not allowlisted");

      const existing = (await serviceRequest(
        `/rest/v1/input_rights_confirmations?owner_id=eq.${ownerId}&is_first_generation_confirmation=eq.true&select=id`,
      )) as Array<{ id: string }>;
      if (existing.length > 0) return { recorded: false };

      try {
        await serviceRequest("/rest/v1/input_rights_confirmations", {
          method: "POST",
          body: JSON.stringify({
            owner_id: ownerId,
            is_first_generation_confirmation: true,
            policy_version: "customer-pilot-2026-08-24",
          }),
        });
      } catch {
        const concurrent = (await serviceRequest(
          `/rest/v1/input_rights_confirmations?owner_id=eq.${ownerId}&is_first_generation_confirmation=eq.true&select=id`,
        )) as Array<{ id: string }>;
        if (concurrent.length === 0) throw new Error("Could not record input rights confirmation");
      }

      return { recorded: true };
    },

    async recordAiCoachConsent({ lineUserId }: { lineUserId: string }) {
      const ownerId = await findLinkedUserId(lineUserId);
      if (!ownerId) throw new Error("LINE-linked account does not exist");

      const access = await this.claimForVerifiedLineIdentity({ lineUserId });
      if (!access.isAllowlisted) throw new Error("Pilot access is not allowlisted");

      const policyVersion = "ai-coach-provider-disclosure-2026-08-24";
      const existing = (await serviceRequest(
        `/rest/v1/ai_coach_consents?owner_id=eq.${ownerId}&policy_version=eq.${policyVersion}&select=id`,
      )) as Array<{ id: string }>;
      if (existing.length > 0) return { recorded: false };

      try {
        await serviceRequest("/rest/v1/ai_coach_consents", {
          method: "POST",
          body: JSON.stringify({ owner_id: ownerId, policy_version: policyVersion }),
        });
      } catch {
        const concurrent = (await serviceRequest(
          `/rest/v1/ai_coach_consents?owner_id=eq.${ownerId}&policy_version=eq.${policyVersion}&select=id`,
        )) as Array<{ id: string }>;
        if (concurrent.length === 0) throw new Error("Could not record AI Coach consent");
      }

      return { recorded: true };
    },
  };
}
