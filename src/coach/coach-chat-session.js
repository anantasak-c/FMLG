const CHAT_SKILLS = new Set(["general", "create-flux3-video"]);

export function startCoachChatSession({ selectedSkillId = null, aiCoachConsent = false } = {}) {
  return {
    kind: "skill-chat-session",
    version: 2,
    aiCoachConsent: aiCoachConsent === true,
    selectedSkillId: CHAT_SKILLS.has(selectedSkillId) ? selectedSkillId : null,
    messages: selectedSkillId ? [createGreeting(selectedSkillId)] : [],
    updatedAt: new Date().toISOString(),
  };
}

export function restoreCoachChatSession(value) {
  if (value?.kind === "skill-chat-session" && value.version === 2 && Array.isArray(value.messages)) {
    const selectedSkillId = CHAT_SKILLS.has(value.selectedSkillId) ? value.selectedSkillId : null;
    return { ...startCoachChatSession({ selectedSkillId, aiCoachConsent: value.aiCoachConsent }), ...value, selectedSkillId };
  }
  if (value?.kind === "coach-chat-session" && value.version === 1 && Array.isArray(value.messages)) {
    return {
      ...startCoachChatSession({ selectedSkillId: "create-flux3-video", aiCoachConsent: value.aiCoachConsent }),
      messages: value.messages
        .filter((message) => message?.role === "user" || message?.role === "assistant")
        .map((message) => ({ id: message.id ?? cryptoId(), role: message.role, text: String(message.text ?? ""), status: "complete", createdAt: message.createdAt ?? new Date().toISOString() }))
        .filter((message) => message.text.trim()),
    };
  }
  return null;
}

export function chooseCoachSkill(session, selectedSkillId) {
  if (!CHAT_SKILLS.has(selectedSkillId) || session.selectedSkillId) return session;
  return { ...session, selectedSkillId, messages: [createGreeting(selectedSkillId)], updatedAt: new Date().toISOString() };
}

export function setCoachConsent(session, accepted) {
  return { ...session, aiCoachConsent: accepted === true, updatedAt: new Date().toISOString() };
}

export function appendChatMessage(session, { role, text, status = "complete" }) {
  const message = { id: cryptoId(), role, text, status, createdAt: new Date().toISOString() };
  return [{ ...session, messages: [...session.messages, message], updatedAt: new Date().toISOString() }, message];
}

export function updateChatMessage(session, messageId, patch) {
  return { ...session, messages: session.messages.map((message) => message.id === messageId ? { ...message, ...patch } : message), updatedAt: new Date().toISOString() };
}

export function createChatHistory(session) {
  return session.messages
    .filter((message) => (message.role === "user" || message.role === "assistant") && message.text.trim() && message.status !== "error")
    .slice(-24)
    .map((message) => ({ role: message.role, content: message.text }));
}

function createGreeting(skillId) {
  const text = skillId === "create-flux3-video"
    ? "เล่าไอเดียวิดีโอหรือส่งรายละเอียดสิ่งที่มีมาได้เลย ผมจะใช้ Skill FLUX.3 ช่วยคิด กำกับ เขียน หรือ audit prompt ให้ตามที่งานต้องการ"
    : "คุยมาได้เลยครับ ผมช่วยคิด แตกทางเลือก เขียน หรือแก้ปัญหาให้แบบแชททั่วไป";
  return { id: cryptoId(), role: "assistant", text, status: "complete", createdAt: new Date().toISOString() };
}

function cryptoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
