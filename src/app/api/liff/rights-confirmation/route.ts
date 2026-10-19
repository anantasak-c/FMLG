import { verifyLineIdToken } from "../../../../pilot/line-id-token.js";
import { createSupabasePilotAccessRepository } from "../../../../pilot/supabase-pilot-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { idToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "ไม่สามารถบันทึกการยืนยันได้" }, { status: 400 });
  }

  if (typeof body.idToken !== "string" || body.idToken.length === 0) {
    return Response.json({ message: "ไม่สามารถยืนยันบัญชี LINE ได้" }, { status: 401 });
  }

  try {
    const identity = await verifyLineIdToken({
      idToken: body.idToken,
      channelId: process.env.LINE_LOGIN_CHANNEL_ID ?? "",
    });
    const result = await createSupabasePilotAccessRepository().recordInitialRightsConfirmation({
      lineUserId: identity.lineUserId,
    });
    return Response.json(result);
  } catch {
    return Response.json({ message: "ไม่สามารถบันทึกการยืนยันได้" }, { status: 403 });
  }
}
