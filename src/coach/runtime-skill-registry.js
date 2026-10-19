const SKILLS = Object.freeze({
  general: Object.freeze({
    id: "general",
    label: "ทั่วไป",
    kind: "general",
    description: "คุยกับ AI แบบอิสระโดยไม่โหลด workflow เพิ่มเติม",
  }),
  "video-creative-director": Object.freeze({
    id: "video-creative-director",
    label: "Creative Director",
    kind: "base",
    description: "Grill, treatment, FOMOlogy knowledge, continuity และ quality gate",
  }),
  "create-flux3-video": Object.freeze({
    id: "create-flux3-video",
    label: "FLUX.3 Video",
    kind: "provider",
    description: "Prompt และ payload แบบ dry-run สำหรับ FLUX.3",
    supportedModes: ["t2v", "i2v"],
  }),
});

export function listRuntimeSkills() {
  return Object.values(SKILLS).map((skill) => ({ ...skill }));
}

export function selectRuntimeSkills({ overrideId = "auto", brief = {}, message = "" } = {}) {
  const providerId = overrideId === "auto" ? "create-flux3-video" : overrideId;
  const provider = SKILLS[providerId];
  if (!provider || provider.kind !== "provider") throw new Error("Unknown provider skill.");
  const sourceMode = brief.sourceMode ?? (/\b(?:mp4|video-to-video|ต่อวิดีโอ)\b/i.test(message) ? "v2v" : /(?:ภาพ|รูป|image|still)/i.test(message) ? "i2v" : "t2v");
  return {
    skillIds: ["video-creative-director", providerId],
    providerSkillId: providerId,
    sourceMode,
  };
}

export function getRuntimeSkill(skillId) {
  const skill = SKILLS[skillId];
  if (!skill) throw new Error("Unknown runtime skill.");
  return { ...skill };
}

export function selectChatSkill(skillId) {
  const skill = SKILLS[skillId];
  if (!skill || !["general", "provider"].includes(skill.kind)) throw new Error("Unknown chat skill.");
  return { ...skill };
}
