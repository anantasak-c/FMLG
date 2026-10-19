"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { appendChatMessage, chooseCoachSkill, createChatHistory, restoreCoachChatSession, setCoachConsent, startCoachChatSession, updateChatMessage } from "../coach/coach-chat-session";
import { restoreGuestCoachSession, saveGuestCoachSession } from "../coach/guest-session-storage";

type MessageStatus = "complete" | "streaming" | "stopped" | "error";
type Message = { id: string; role: "user" | "assistant"; text: string; status: MessageStatus; createdAt: string };
type SkillId = "general" | "create-flux3-video";
type ChatSession = { kind: "skill-chat-session"; version: 2; aiCoachConsent: boolean; selectedSkillId: SkillId | null; messages: Message[]; updatedAt: string };

const initialSession = startCoachChatSession() as ChatSession;

const SKILLS: Array<{ id: SkillId; eyebrow: string; title: string; description: string }> = [
  { id: "general", eyebrow: "NO WORKFLOW", title: "ทั่วไป", description: "คุย คิด เขียน และแตกทางเลือกแบบแชทอิสระ ไม่บังคับโครงคำตอบ" },
  { id: "create-flux3-video", eyebrow: "VIDEO SKILL", title: "FLUX.3 Video", description: "ช่วยกำกับไอเดีย Grill เฉพาะจุด เขียน prompt, shot plan และ API payload" },
];

export function GuestCoachForm() {
  const [session, setSession] = useState<ChatSession>(initialSession);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const transcriptEnd = useRef<HTMLDivElement>(null);
  const activeController = useRef<AbortController | null>(null);

  useEffect(() => {
    const restored = restoreCoachChatSession(restoreGuestCoachSession(window.localStorage)) as ChatSession | null;
    if (restored) setSession(restored);
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveGuestCoachSession(window.localStorage, session); }, [hydrated, session]);
  useEffect(() => { transcriptEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [busy, session.messages]);
  useEffect(() => () => activeController.current?.abort(), []);

  async function sendMessage(text: string, baseOverride?: ChatSession) {
    const clean = text.trim();
    const base = baseOverride ?? session;
    if (!clean || busy || !base.selectedSkillId) return;
    if (!base.aiCoachConsent) { setError("กรุณายอมรับการใช้ AI ก่อนส่งข้อความ"); return; }

    const history = createChatHistory(base);
    const [withUser] = appendChatMessage(base, { role: "user", text: clean });
    const [withAssistant, assistantMessage] = appendChatMessage(withUser, { role: "assistant", text: "", status: "streaming" });
    const assistantId = assistantMessage.id as string;
    let accumulated = "";
    setSession(withAssistant as ChatSession);
    setDraft("");
    setError("");
    setBusy(true);

    const controller = new AbortController();
    activeController.current = controller;
    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: clean, skillId: base.selectedSkillId, aiCoachConsent: base.aiCoachConsent }),
      });
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "AI ยังตอบไม่ได้");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setSession((current) => updateChatMessage(current, assistantId, { text: accumulated, status: "streaming" }) as ChatSession);
      }
      accumulated += decoder.decode();
      setSession((current) => updateChatMessage(current, assistantId, { text: accumulated, status: "complete" }) as ChatSession);
    } catch (cause) {
      const stopped = controller.signal.aborted;
      setSession((current) => updateChatMessage(current, assistantId, { text: accumulated, status: stopped ? "stopped" : "error" }) as ChatSession);
      if (!stopped) setError(cause instanceof Error ? cause.message : "AI ยังตอบไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      if (activeController.current === controller) activeController.current = null;
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function resetChat() {
    activeController.current?.abort();
    setSession(startCoachChatSession({ aiCoachConsent: session.aiCoachConsent }) as ChatSession);
    setDraft("");
    setError("");
  }

  function retryTurn(assistantId: string) {
    const assistantIndex = session.messages.findIndex((message) => message.id === assistantId);
    const userMessage = session.messages[assistantIndex - 1];
    if (assistantIndex < 1 || userMessage?.role !== "user") return;
    const base = { ...session, messages: session.messages.slice(0, assistantIndex - 1) };
    void sendMessage(userMessage.text, base);
  }

  return (
    <main className={darkMode ? "coach-app dark" : "coach-app"}>
      <header className="studio-topbar">
        <div className="brand-lockup"><span className="brand-mark">F</span><div><strong>FOMOlogy</strong><small>Skill Chat</small></div></div>
        <div className="topbar-actions">
          <span className="runtime-status"><i /> Ox Alpha · Free fallback</span>
          <button className="ghost-button" type="button" onClick={() => setDarkMode((value) => !value)}>{darkMode ? "สว่าง" : "มืด"}</button>
          {session.selectedSkillId && <button className="ghost-button" type="button" onClick={resetChat}>แชทใหม่</button>}
        </div>
      </header>

      {!session.selectedSkillId ? (
        <section className="skill-start">
          <p className="eyebrow">CHOOSE A SKILL</p>
          <h1>อยากให้ AI ช่วยแบบไหน?</h1>
          <p className="start-lead">เลือก Skill สำหรับห้องนี้ แล้วคุยได้ตามธรรมชาติ ไม่มีฟอร์มหรือขั้นตอนบังคับ</p>
          <div className="skill-cards">
            {SKILLS.map((skill) => (
              <button key={skill.id} className="skill-card" type="button" onClick={() => setSession(chooseCoachSkill(session, skill.id) as ChatSession)}>
                <span>{skill.eyebrow}</span><strong>{skill.title}</strong><p>{skill.description}</p><i>เริ่มแชท →</i>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="chat-shell" aria-labelledby="chat-title">
          <div className="chat-heading">
            <div><p className="eyebrow">AI CHAT</p><h1 id="chat-title">{session.selectedSkillId === "general" ? "คุยกับ FOMOlogy" : "สร้างวิดีโอด้วย FLUX.3 Skill"}</h1></div>
            <span className="active-skill"><i />{session.selectedSkillId === "general" ? "ทั่วไป" : "create-flux3-video"}</span>
          </div>

          <div className="transcript" aria-live="polite">
            {session.messages.map((message) => (
              <article className={`message ${message.role}`} key={message.id}>
                <span className="message-avatar">{message.role === "assistant" ? "F" : "คุณ"}</span>
                <div className="message-stack">
                  <div className="message-body">
                    {message.role === "assistant" ? (
                      message.text ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown> : <span className="stream-dots"><i /><i /><i /></span>
                    ) : <p>{message.text}</p>}
                  </div>
                  {message.status === "stopped" && <small className="message-status">หยุดการตอบแล้ว</small>}
                  {message.status === "error" && <div className="message-status error">คำตอบขาดตอน <button type="button" disabled={busy} onClick={() => retryTurn(message.id)}>ลองตอบใหม่</button></div>}
                </div>
              </article>
            ))}
            <div ref={transcriptEnd} />
          </div>

          <div className="composer-wrap">
            <form className="composer" onSubmit={submit}>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} disabled={busy} placeholder={session.selectedSkillId === "general" ? "พิมพ์สิ่งที่อยากคุย…" : "เล่าไอเดียวิดีโอ หรือวาง prompt ที่อยากให้ช่วย audit…"} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (draft.trim()) void sendMessage(draft); } }} />
              {busy ? <button className="stop-button" type="button" onClick={() => activeController.current?.abort()}>หยุด</button> : <button className="send-button" type="submit" disabled={!draft.trim()}>ส่ง →</button>}
            </form>
            <label className="consent-row"><input type="checkbox" checked={session.aiCoachConsent} onChange={(event) => { setError(""); setSession(setCoachConsent(session, event.target.checked) as ChatSession); }} /><span>ยอมรับให้ส่งบทสนทนาไปยังผู้ให้บริการ AI ภายนอก และจะหลีกเลี่ยงข้อมูลส่วนบุคคลที่ไม่จำเป็น</span></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <p className="storage-note">บันทึกบทสนทนาไว้ใน browser เครื่องนี้อัตโนมัติ</p>
          </div>
        </section>
      )}
    </main>
  );
}
