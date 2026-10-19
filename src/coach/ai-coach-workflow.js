import { updateGuestCoachSession } from "./guest-session.js";

const QUESTIONS = {
  publishingTarget: choiceQuestion("publishingTarget", "ขั้นตอน 1 · ปลายทาง", "อยากนำวิดีโอนี้ไปใช้ที่ไหนเป็นหลัก?", [
    ["reels_tiktok", "Reels/TikTok", "แนะนำ", "เริ่มต้นง่ายและดึงความสนใจได้เร็ว"],
    ["facebook_post", "Facebook Post", "", "เหมาะกับโพสต์ที่คนหยุดอ่านรายละเอียด"],
    ["youtube_large_screen", "YouTube/จอใหญ่", "", "เหมาะกับภาพกว้างและจังหวะเล่าเรื่อง"],
  ]),
  audioChoice: choiceQuestion("audioChoice", "ขั้นตอน 2 · เสียง", "อยากให้วิดีโอนี้มีเสียงไหม?", [
    ["with_audio", "มีเสียง", "แนะนำ", "ช่วยย้ำอารมณ์และ message ได้ในคลิปสั้น"],
    ["without_audio", "ไม่มีเสียง", "", "เหมาะเมื่อจะใส่เพลงหรือเสียงเองภายหลัง"],
  ]),
  dialoguePreview: choiceQuestion("dialoguePreview", "ขั้นตอน 3 · บทพูด", "ถ้ามีคำพูด อยากให้เสียงพาเรื่องแบบไหน?", [
    ["__ambient__", "มีแค่เสียงบรรยากาศ", "แนะนำ", "คลิปจะยืดหยุ่นกับการตัดต่อภายหลัง"],
    ["__custom__", "พิมพ์ประโยคไทยเอง", "", "ใช้เมื่อมีประโยคสั้น ๆ ที่ต้องได้ยิน"],
  ]),
  promise: choiceQuestion("promise", "ขั้นตอน 4 · ความรู้สึก", "หลังดูจบ คนดูควรรู้สึก เชื่อ หรือจำอะไรหนึ่งอย่าง?", [
    ["น่าเชื่อถือและอยากรู้ต่อ", "น่าเชื่อถือและอยากรู้ต่อ", "แนะนำ", "ใช้เป็นแกนที่ชัดเจนสำหรับคลิปสั้น"],
    ["พรีเมียมและน่าจดจำ", "พรีเมียมและน่าจดจำ", "", "เหมาะกับสินค้าและภาพลักษณ์"],
    ["__custom__", "พิมพ์ความรู้สึกเอง", "", "ใช้เมื่อคุณมีผลลัพธ์ที่เฉพาะเจาะจง"],
  ]),
  sourceImage: choiceQuestion("sourceImage", "ขั้นตอน 5 · ภาพอ้างอิง", "Image-to-Video ต้องใช้ภาพอ้างอิง 1 ภาพ คุณอยากใช้อะไรเป็นจุดตั้งต้น?", [
    ["__custom__", "อธิบายภาพที่จะอัปโหลด", "แนะนำ", "AI จะใช้ล็อกหน้า ชุด หรือสินค้าที่อยู่ในภาพ"],
    ["__switch_to_text__", "เปลี่ยนเป็นสร้างจากคำบรรยาย", "", "เหมาะเมื่อยังไม่มีภาพที่มีสิทธิ์ใช้"],
  ]),
  formatSpecificity: choiceQuestion("formatSpecificity", "ขั้นตอนเสริม · ภาษาภาพ", "คำว่า cinematic ของคุณหมายถึงรูปแบบไหน?", [
    ["ภาพยนตร์ร่วมสมัย", "ภาพยนตร์ร่วมสมัย", "แนะนำ", "คุมแสง กล้อง และจังหวะได้ชัด"],
    ["TVC", "TVC", "", "โฟกัสสินค้าและ message ที่จำง่าย"],
    ["documentary", "documentary", "", "เน้นความจริงและกล้องที่มีที่มา"],
  ]),
  beatDensity: choiceQuestion("beatDensity", "ขั้นตอนเสริม · จังหวะ", "คลิปสั้นนี้มีหลายเหตุการณ์เกินไป อยากเก็บอะไรเป็นแกน?", [
    ["เก็บเหตุการณ์ที่ทำให้คนดูจำ promise ได้", "เก็บเหตุการณ์ที่ทำให้คนดูจำ promise ได้", "แนะนำ", "ทำให้ action อ่านออกในเวลาสั้น"],
    ["__custom__", "ระบุเหตุการณ์ที่อยากเก็บ", "", "เลือกเมื่อมี moment ที่สำคัญจริง ๆ"],
  ]),
};

export function nextAdaptiveGrillRound(session) {
  const brief = session.creativeBrief;
  const question = nextQuestion(brief);
  const readyToGenerate = !question && isReadyToGenerate(brief);
  return { questions: question ? [question] : [], lockedSummary: createLockedSummary(brief), readyToGenerate, nextAction: readyToGenerate ? "create-or-adjust" : "answer-question" };
}

export function answerAdaptiveGrill(session, answers) {
  const normalizedAnswers = { ...answers };
  if (answers.sourceImage === "__switch_to_text__") { normalizedAnswers.sourceMode = "text_to_video"; delete normalizedAnswers.sourceImage; }
  if (answers.dialoguePreview === "__custom__") { normalizedAnswers.dialoguePreview = null; normalizedAnswers.dialogueDecided = false; }
  if (answers.formatSpecificity) { normalizedAnswers.format = answers.formatSpecificity; delete normalizedAnswers.formatSpecificity; }
  if (answers.beatDensity) { normalizedAnswers.focusBeat = answers.beatDensity; normalizedAnswers.requestedBeatCount = 1; delete normalizedAnswers.beatDensity; }
  if (answers.sourceImage) { normalizedAnswers.referenceAssets = [answers.sourceImage]; delete normalizedAnswers.sourceImage; }
  if (answers.audioChoice) normalizedAnswers.audioChoice = answers.audioChoice === "มีเสียง" ? "with_audio" : answers.audioChoice;
  if (answers.dialoguePreview === "__ambient__") {
    normalizedAnswers.dialoguePreview = null;
    normalizedAnswers.dialogueDecided = true;
  } else if (Object.hasOwn(answers, "dialoguePreview")) {
    normalizedAnswers.dialoguePreview = answers.dialoguePreview || null;
    normalizedAnswers.dialogueDecided = true;
  }
  return updateGuestCoachSession(session, normalizedAnswers);
}

function choiceQuestion(id, step, prompt, choices) {
  const firstRecommended = choices.find(([,, badge]) => badge === "แนะนำ") ?? choices[0];
  return {
    id,
    step,
    prompt,
    choices: choices.map(([value, label, badge, reason]) => ({ value, label, recommended: badge === "แนะนำ", reason })),
    recommendedValue: firstRecommended[0],
  };
}

export function confirmCreativeBrief(session) {
  const confirmedSession = updateGuestCoachSession(session, { confirmed: true });
  return { ...confirmedSession, confirmationSummary: createLockedSummary(confirmedSession.creativeBrief) };
}

function nextQuestion(brief) {
  if (!brief.publishingTarget) return QUESTIONS.publishingTarget;
  if (!brief.audioChoice) return QUESTIONS.audioChoice;
  if (brief.audioChoice === "with_audio" && !brief.dialogueDecided) return QUESTIONS.dialoguePreview;
  if (!brief.promise) return QUESTIONS.promise;
  if (brief.sourceMode === "image_to_video" && brief.referenceAssets.length === 0) return QUESTIONS.sourceImage;
  if (isAmbiguousFormat(brief.format)) return QUESTIONS.formatSpecificity;
  if (hasOverdenseTimeline(brief)) return QUESTIONS.beatDensity;
  return null;
}

function isReadyToGenerate(brief) { return Boolean(brief.idea?.trim() && brief.promise?.trim() && brief.publishingTarget && brief.audioChoice && (brief.sourceMode === "text_to_video" || brief.referenceAssets.length > 0)); }
function isAmbiguousFormat(format) { return typeof format === "string" && format.trim().toLowerCase() === "cinematic"; }
function hasOverdenseTimeline(brief) { return Boolean(brief.durationSeconds && brief.requestedBeatCount > Math.max(1, Math.floor(brief.durationSeconds / 3))); }
function createLockedSummary(brief) {
  const target = { reels_tiktok: "Reels/TikTok", facebook_post: "Facebook Post", youtube_large_screen: "YouTube/จอใหญ่" }[brief.publishingTarget];
  const details = [brief.idea && `ไอเดีย: ${brief.idea}`, brief.promise && `เป้าหมาย: ${brief.promise}`, target && `ปลายทาง: ${target}`, brief.audioChoice && `เสียง: ${brief.audioChoice === "with_audio" ? "มีเสียง" : "ไม่มีเสียง"}`, brief.dialoguePreview && `บทพูด: ${brief.dialoguePreview}`].filter(Boolean);
  return details.length ? `สิ่งที่ล็อกไว้แล้ว — ${details.join(" · ")}` : "ยังไม่มีสิ่งที่ล็อกไว้";
}
