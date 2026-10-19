import { createProductionPromptEngine } from "../../../../coach/server-prompt-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { brief?: Record<string, unknown>; aiCoachConsent?: unknown };
  try { body = await request.json(); } catch { return Response.json({ message: "กรุณาส่ง Creative Brief ที่ถูกต้อง" }, { status: 400 }); }
  if (body.aiCoachConsent !== true) return Response.json({ message: "กรุณายอมรับการใช้ AI Coach ก่อนดำเนินการ" }, { status: 428 });
  const brief = body.brief ?? {};
  if (typeof brief.idea !== "string" || !brief.idea.trim()) return Response.json({ message: "กรุณาเล่าไอเดียก่อน" }, { status: 400 });
  try {
    const question = await createProductionPromptEngine().complete({
      system: "You are FOMOlogy AI Coach. Reply in Thai with exactly one compact, plain-language follow-up question. Never reveal model names, provider settings, or prompt syntax.",
      user: JSON.stringify({ idea: brief.idea, sourceMode: brief.sourceMode, publishingTarget: brief.publishingTarget, audioChoice: brief.audioChoice, promise: brief.promise }),
    });
    return Response.json({ question });
  } catch { return Response.json({ message: "AI Coach ยังตอบไม่ได้ กรุณาลองใหม่" }, { status: 503 }); }
}
