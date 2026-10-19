import { verifyLineIdToken } from "../../../../pilot/line-id-token";
import { createSupabasePilotAccessRepository } from "../../../../pilot/supabase-pilot-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { idToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "ไม่สามารถยืนยันบัญชี LINE ได้ กรุณาลองใหม่" }, { status: 401 });
  }
  if (typeof body.idToken !== "string" || !body.idToken) {
    return Response.json({ message: "ไม่สามารถยืนยันบัญชี LINE ได้ กรุณาลองใหม่" }, { status: 401 });
  }

  try {
    const identity = await verifyLineIdToken({ idToken: body.idToken, channelId: process.env.LINE_LOGIN_CHANNEL_ID ?? "" });
    const result = await createSupabasePilotAccessRepository().recordAiCoachConsent({ lineUserId: identity.lineUserId });
    return Response.json(result);
  } catch {
    return Response.json({ message: "บันทึกการยอมรับ AI Coach ไม่สำเร็จ กรุณาลองใหม่" }, { status: 503 });
  }
}
