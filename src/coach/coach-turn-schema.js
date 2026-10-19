import { validateFlux3Payload } from "./flux3-payload.js";

const BRIEF_FIELDS = new Set([
  "idea", "promise", "viewer", "publishingTarget", "successCriterion", "durationSeconds", "aspectRatio", "sourceMode",
  "referenceAssets", "world", "characters", "continuityLocks", "beats", "finalFrame", "camera", "audio", "dialogueThai",
  "negativeConstraints", "assumptions", "confirmedFields",
]);

export function parseCoachTurnJson(content) {
  if (typeof content !== "string") throw new Error("Coach output is not text.");
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Coach output has no JSON object.");
  return JSON.parse(trimmed.slice(start, end + 1));
}

export function validateCoachTurn(input, { requiredSkillIds = ["video-creative-director", "create-flux3-video"] } = {}) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, errors: ["turn must be an object"] };
  if (!["question", "ready"].includes(input.type)) errors.push("type must be question or ready");
  if (!isText(input.coach_message)) errors.push("coach_message is required");
  if (!isText(input.rationale)) errors.push("rationale is required");
  if (!Array.isArray(input.selected_skill_ids) || requiredSkillIds.some((id) => !input.selected_skill_ids.includes(id))) errors.push("selected_skill_ids must include every active skill");
  if (input.brief_patch !== undefined) validateBriefPatch(input.brief_patch, errors);
  if (!Array.isArray(input.locked_summary) || input.locked_summary.some((item) => !isText(item))) errors.push("locked_summary must be a string array");

  if (input.type === "question") validateQuestion(input.question, errors);
  if (input.type === "ready") validatePackage(input.package, errors);
  return { ok: errors.length === 0, errors, value: errors.length ? undefined : input };
}

function validateBriefPatch(patch, errors) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) { errors.push("brief_patch must be an object"); return; }
  for (const [key, value] of Object.entries(patch)) {
    if (!BRIEF_FIELDS.has(key)) errors.push(`brief_patch.${key} is not allowed`);
    if (!isSafeValue(value, 0)) errors.push(`brief_patch.${key} is too deep or invalid`);
  }
  if (patch.durationSeconds !== undefined && (!Number.isInteger(patch.durationSeconds) || patch.durationSeconds < 5 || patch.durationSeconds > 20)) errors.push("brief_patch.durationSeconds must be 5–20");
  if (patch.aspectRatio !== undefined && !["21:9", "2:1", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(patch.aspectRatio)) errors.push("brief_patch.aspectRatio is invalid");
  if (patch.sourceMode !== undefined && !["t2v", "i2v"].includes(patch.sourceMode)) errors.push("brief_patch.sourceMode is outside pilot scope");
}

function validateQuestion(question, errors) {
  if (!question || typeof question !== "object") { errors.push("question is required"); return; }
  if (!isText(question.id) || !isText(question.text)) errors.push("question id and text are required");
  if (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > 4) { errors.push("question must have 2–4 options"); return; }
  const ids = new Set();
  const labels = new Set();
  const answers = new Set();
  for (const option of question.options) {
    if (!isText(option?.id) || !isText(option?.label) || !isText(option?.answer) || !isText(option?.rationale)) errors.push("every option needs id, label, answer, and rationale");
    ids.add(normalize(option?.id)); labels.add(normalize(option?.label)); answers.add(normalize(option?.answer));
  }
  if (ids.size !== question.options.length || labels.size !== question.options.length || answers.size !== question.options.length) errors.push("options must be genuinely distinct");
  if (!ids.has(normalize(question.recommended_option_id))) errors.push("recommended_option_id must identify an option");
}

function validatePackage(output, errors) {
  if (!output || typeof output !== "object") { errors.push("package is required"); return; }
  for (const key of ["thai_summary", "generation_prompt", "negative_prompt"]) if (!isText(output[key])) errors.push(`package.${key} is required`);
  for (const key of ["thai_dialogue_sheet", "continuity_checklist"]) if (!Array.isArray(output[key])) errors.push(`package.${key} must be an array`);
  const gate = output.quality_gate;
  if (!gate || !["pass", "warning", "block"].includes(gate.status) || !Array.isArray(gate.warnings) || !Array.isArray(gate.blocks)) errors.push("package.quality_gate is invalid");
  if (gate?.status === "block" || gate?.blocks?.length) errors.push("a blocked package cannot be ready");
  if (!output.retrieval || !isText(output.retrieval.knowledge_base_version) || !Array.isArray(output.retrieval.section_ids) || output.retrieval.section_ids.length === 0) errors.push("package.retrieval is required");
  if (output.dry_run !== true) errors.push("package must be dry_run");
  const payloadValidation = validateFlux3Payload(output.payload);
  if (!payloadValidation.ok) errors.push(...payloadValidation.errors.map((error) => `package.payload: ${error}`));
}

function isText(value) { return typeof value === "string" && value.trim().length > 0 && value.length <= 12000; }
function normalize(value) { return typeof value === "string" ? value.trim().toLocaleLowerCase("th") : ""; }
function isSafeValue(value, depth) {
  if (depth > 4) return false;
  if (value === null || typeof value === "boolean" || typeof value === "number") return true;
  if (typeof value === "string") return value.length <= 12000;
  if (Array.isArray(value)) return value.length <= 30 && value.every((item) => isSafeValue(item, depth + 1));
  if (typeof value === "object") return Object.keys(value).length <= 30 && Object.values(value).every((item) => isSafeValue(item, depth + 1));
  return false;
}
