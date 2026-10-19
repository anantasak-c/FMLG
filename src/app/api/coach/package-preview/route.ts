import { createCreatorSafePreview } from "../../../../coach/server-creative-harness";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { brief?: Record<string, unknown>; aiCoachConsent?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "กรุณาส่ง Creative Brief ที่ถูกต้อง" }, { status: 400 });
  }
  if (body.aiCoachConsent !== true) {
    return Response.json({ message: "กรุณายอมรับการใช้ AI Coach ก่อนดำเนินการ" }, { status: 428 });
  }
  if (!body.brief || typeof body.brief.idea !== "string" || !body.brief.idea.trim()) {
    return Response.json({ message: "กรุณาเล่าไอเดียก่อน" }, { status: 400 });
  }

  try {
    return Response.json(createCreatorSafePreview(body.brief));
  } catch {
    return Response.json({ message: "AI Coach ยังสรุป Brief ไม่ได้ กรุณาตรวจคำตอบอีกครั้ง" }, { status: 422 });
  }
}
