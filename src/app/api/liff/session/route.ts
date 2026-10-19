import { establishPilotAccess } from "../../../../pilot/pilot-access.js";
import { verifyLineIdToken } from "../../../../pilot/line-id-token.js";
import { createSupabasePilotAccessRepository } from "../../../../pilot/supabase-pilot-access";

export const runtime = "nodejs";

function invalidRequest() {
  return Response.json({ message: "ไม่สามารถยืนยันบัญชี LINE ได้ กรุณาลองใหม่" }, { status: 401 });
}

export async function POST(request: Request) {
  let body: { idToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return invalidRequest();
  }

  if (typeof body.idToken !== "string" || body.idToken.length === 0) return invalidRequest();

  try {
    const identity = await verifyLineIdToken({
      idToken: body.idToken,
      channelId: process.env.LINE_LOGIN_CHANNEL_ID ?? "",
    });
    const access = await establishPilotAccess({
      verifiedLineIdentity: identity,
      repository: createSupabasePilotAccessRepository(),
    });
    return Response.json(access);
  } catch {
    return invalidRequest();
  }
}
