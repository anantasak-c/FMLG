import { KNOWLEDGE_BASE_VERSION, retrieveKnowledgeForBrief } from "./knowledge/fomology-video-prompt-knowledge.js";
import { applySkillDefaults, selectCoachSkill } from "./skill-registry.js";

const PUBLISHING_LABELS = {
  reels_tiktok: "Reels/TikTok",
  facebook_post: "Facebook Post",
  youtube_large_screen: "YouTube/จอใหญ่",
};

export function prepareCreativeBrief(brief) {
  const defaultsApplied = applySkillDefaults(brief);
  const prepared = {
    ...defaultsApplied,
    world: defaultsApplied.world ?? defaultsApplied.era ?? "โลกและสถานที่ร่วมสมัยที่สอดคล้องกับไอเดีย",
    characterAnchors: defaultsApplied.characterAnchors ?? (defaultsApplied.referenceAssets?.length ? "คง identity anchors จากภาพอ้างอิง 1 ภาพ" : "ไม่มีตัวละครหลักที่ต้องรักษาหน้าเดิม"),
    cameraAudioLogic: defaultsApplied.cameraAudioLogic ?? (defaultsApplied.audioChoice === "with_audio" ? "กล้องและเสียงตอบสนองต่อเหตุการณ์ในฉากอย่างมีสาเหตุ" : "กล้องมีเหตุผลในโลกเรื่อง และเว้นพื้นที่ให้เสียงหลังการผลิต"),
    finalFrame: defaultsApplied.finalFrame ?? `ภาพสุดท้ายยืนยันว่า ${defaultsApplied.promise}`,
  };
  prepared.timeline = defaultsApplied.timeline ?? createTimeline(prepared);
  const skill = selectCoachSkill(prepared);
  const knowledge = retrieveKnowledgeForBrief(prepared);
  const qualityGate = evaluateQualityGate(prepared, skill);
  const assumptions = [];
  if (!brief.durationSeconds) assumptions.push(`เลือกความยาว ${prepared.durationSeconds} วินาทีให้เหมาะกับ Tier ประหยัด`);
  if (prepared.aspectRatio !== brief.aspectRatio) assumptions.push(`ปรับสัดส่วนเป็น ${prepared.aspectRatio} ตามปลายทาง ${PUBLISHING_LABELS[prepared.publishingTarget]}`);
  if (!prepared.format) assumptions.push("ใช้ภาพร่วมสมัยที่อ่านเรื่องและสินค้า/ตัวละครได้ชัดเจน");
  if (!brief.world) assumptions.push("กำหนดโลกและสถานที่จากไอเดียโดยไม่เพิ่มข้อเท็จจริงที่ตรวจสอบไม่ได้");
  if (!brief.finalFrame) assumptions.push("กำหนด final frame ให้ยืนยัน audience promise");

  return {
    creativeBrief: prepared,
    knowledgeBaseVersion: KNOWLEDGE_BASE_VERSION,
    knowledgeEntries: knowledge.map(({ id }) => id),
    qualityGate,
    assumptions,
  };
}

export function compilePromptPackage(brief) {
  const prepared = prepareCreativeBrief(brief);
  const { creativeBrief, knowledgeBaseVersion, knowledgeEntries, qualityGate, assumptions } = prepared;
  const knowledgeRules = retrieveKnowledgeForBrief(creativeBrief).flatMap((entry) => entry.rules);
  const timeline = creativeBrief.timeline;
  const prompt = [
    `Create an ${creativeBrief.durationSeconds}-second ${creativeBrief.aspectRatio} video. ${creativeBrief.promise}.`,
    `IDEA: ${creativeBrief.idea}.`,
    `PUBLISHING TARGET: ${PUBLISHING_LABELS[creativeBrief.publishingTarget]}.`,
    `FORMAT / LOOK: ${creativeBrief.format ?? "clear contemporary cinematic realism"}.`,
    `WORLD / LOCATION: ${creativeBrief.world}.`,
    `CHARACTER / CONTINUITY: ${creativeBrief.characterAnchors}.`,
    `SOURCE MODE: ${creativeBrief.sourceMode === "image_to_video" ? "animate exactly one supplied reference image while preserving its identity anchors" : "generate from text"}.`,
    `CAMERA + AUDIO: ${creativeBrief.cameraAudioLogic}. ${creativeBrief.audioChoice === "with_audio" ? "Include grounded ambience and the specified Thai dialogue." : "No generated dialogue; leave room for post-production audio."}`,
    `TIMELINE: ${timeline}`,
    "PRODUCTION RULES:",
    ...knowledgeRules.map((rule) => `- ${rule}`),
  ].join("\n");
  const negativePrompt = createNegativePrompt(creativeBrief);
  return {
    kind: "prompt-package",
    providerProfile: creativeBrief.providerProfile,
    knowledgeBaseVersion,
    knowledgeEntries,
    creativeBrief,
    thaiSummary: createThaiSummary(creativeBrief, assumptions),
    generationPrompt: prompt,
    negativePrompt,
    dialogueSheet: creativeBrief.dialoguePreview ? [{ startSeconds: 1, endSeconds: Math.min(3, creativeBrief.durationSeconds - 1), text: creativeBrief.dialoguePreview }] : [],
    continuityChecklist: createContinuityChecklist(creativeBrief),
    qualityGate,
    assumptions,
  };
}

export function evaluateQualityGate(brief, skill = selectCoachSkill(brief)) {
  const warnings = [];
  const blocks = [];
  if (!brief.idea?.trim() || !brief.promise?.trim()) blocks.push("ยังไม่มีเป้าหมายของวิดีโอที่ชัดเจน");
  if (!brief.publishingTarget || !brief.audioChoice) blocks.push("ยังต้องเลือกปลายทางและเสียง");
  if (brief.sourceMode === "image_to_video" && brief.referenceAssets?.length !== 1) blocks.push("Image-to-Video ต้องใช้ภาพอ้างอิงเพียง 1 ภาพ");
  if (brief.requestedBeatCount > skill.qualityLimits.maxBeatsForEightSeconds && (brief.durationSeconds ?? 8) <= 8) warnings.push("จำนวนเหตุการณ์อาจแน่นเกินสำหรับคลิปสั้น; แนะนำเก็บแกนเดียว");
  if (brief.audioChoice === "with_audio" && !brief.dialogueDecided) warnings.push("ยังไม่ได้เลือกว่าจะใช้บทพูดหรือเสียงบรรยากาศ");
  if (/(เด็ก|ผู้เยาว์|minor).*(เพศ|sexual|โป๊)|(?:เพศ|sexual|โป๊).*(เด็ก|ผู้เยาว์|minor)/i.test(`${brief.idea} ${brief.safetyBoundary ?? ""}`)) blocks.push("ไม่รองรับเนื้อหาเชิงทางเพศที่เกี่ยวข้องกับผู้เยาว์");
  if (/(deepfake|ปลอมเป็น|เลียนแบบหน้า)/i.test(`${brief.idea} ${brief.safetyBoundary ?? ""}`)) blocks.push("ต้องยืนยันสิทธิ์ของบุคคลจริงก่อนใช้ภาพหรือเสียงที่ระบุตัวตนได้");
  return { status: blocks.length ? "block" : warnings.length ? "warning" : "pass", warnings, blocks };
}

function createTimeline(brief) {
  const midpoint = Math.max(2, Math.floor(brief.durationSeconds / 2));
  const finalStart = Math.max(midpoint + 1, brief.durationSeconds - 2);
  return `0-${midpoint}s: establish the world and the audience promise. ${midpoint}-${finalStart}s: one readable action with physical cause and result. ${finalStart}-${brief.durationSeconds}s: ${brief.finalFrame ?? `decisive final frame that proves ${brief.promise}`}.`;
}

function createNegativePrompt(brief) {
  const constraints = ["unreadable action", "identity or costume changes", "unexplained camera shake", "text, subtitles, logos, watermarks"];
  if (brief.sourceMode === "image_to_video") constraints.push("multiple reference images", "altered face or product identity");
  if (brief.safetyBoundary) constraints.push(brief.safetyBoundary);
  constraints.push(...(brief.negativeConstraints ?? []));
  return [...new Set(constraints)].join(", ");
}

function createContinuityChecklist(brief) {
  return [
    "Audience promise is visible in the first seconds and final frame.",
    "Character count, costume, signature prop, and spatial direction stay consistent.",
    "Each major action has physical cause, contact/evasion, and result.",
    brief.sourceMode === "image_to_video" ? "Exactly one reference image remains the identity anchor." : "No reference-image identity claim is implied.",
  ];
}

function createThaiSummary(brief, assumptions) {
  return {
    title: brief.idea,
    promise: brief.promise,
    publishingTarget: PUBLISHING_LABELS[brief.publishingTarget],
    durationSeconds: brief.durationSeconds,
    aspectRatio: brief.aspectRatio,
    audio: brief.audioChoice === "with_audio" ? "มีเสียง" : "ไม่มีเสียง",
    sourceMode: brief.sourceMode === "image_to_video" ? "ใช้ภาพอ้างอิง 1 ภาพ" : "สร้างจากคำบรรยาย",
    tier: "ประหยัด",
    assumptions,
  };
}
