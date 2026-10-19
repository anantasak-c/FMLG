import { streamProductionSkillChat } from "../../../../coach/server-skill-chat";

export const runtime = "nodejs";
export const maxDuration = 120;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  let body: { history?: unknown; message?: unknown; skillId?: unknown; aiCoachConsent?: unknown };
  try { body = await request.json(); } catch { return Response.json({ message: "ข้อมูลแชทไม่ถูกต้อง" }, { status: 400 }); }
  if (body.aiCoachConsent !== true) return Response.json({ message: "กรุณายอมรับการใช้ AI ก่อนเริ่มคุย" }, { status: 428 });
  if (typeof body.message !== "string" || !body.message.trim() || body.message.length > 4000) return Response.json({ message: "กรุณาส่งข้อความ 1–4,000 ตัวอักษร" }, { status: 400 });
  if (typeof body.skillId !== "string" || !["general", "create-flux3-video"].includes(body.skillId)) return Response.json({ message: "ไม่รู้จัก Skill ที่เลือก" }, { status: 400 });
  const history = validateHistory(body.history);
  if (!history) return Response.json({ message: "ประวัติแชทไม่ถูกต้องหรือยาวเกินไป" }, { status: 400 });

  try {
    const stream = await streamProductionSkillChat({ skillId: body.skillId, messages: [...history, { role: "user", content: body.message.trim() }], signal: request.signal });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    if (!request.signal.aborted) console.error("Skill chat failed:", error instanceof Error ? error.message : "unknown error");
    return Response.json({ message: "AI ยังตอบไม่สำเร็จ กรุณาลองอีกครั้ง" }, { status: 503 });
  }
}

function validateHistory(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length > 24) return null;
  let totalLength = 0;
  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const role = (item as Record<string, unknown>).role;
    const content = (item as Record<string, unknown>).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim() || content.length > 8000) return null;
    totalLength += content.length;
    if (totalLength > 48_000) return null;
    messages.push({ role, content: content.trim() });
  }
  return messages;
}
