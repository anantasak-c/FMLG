import assert from "node:assert/strict";
import test from "node:test";
import { runCoachBrain } from "../src/coach/coach-brain.js";
import { validateCoachTurn } from "../src/coach/coach-turn-schema.js";
import { createFlux3DryRunPayload, validateFlux3Payload } from "../src/coach/flux3-payload.js";
import { selectRuntimeSkills } from "../src/coach/runtime-skill-registry.js";

const skillIds = ["video-creative-director", "create-flux3-video"];
function validQuestion() {
  return { type: "question", coach_message: "ผมเห็นทางกำกับที่ต่างกันสองทาง", rationale: "อารมณ์ปลายทางจะเปลี่ยนทั้ง action และกล้อง", selected_skill_ids: skillIds, brief_patch: { idea: "โฆษณาน้ำพริกไทย" }, locked_summary: ["สินค้าเป็นน้ำพริกไทย"], question: { id: "audience_promise", text: "อยากให้คนดูรู้สึกอย่างไร?", options: [{ id: "a", label: "หิวทันที", answer: "อยากให้หิวและอยากชิมทันที", rationale: "ใช้สัมผัสอาหารและจังหวะเร็ว" }, { id: "b", label: "ภูมิใจในรากไทย", answer: "อยากให้ภูมิใจกับภูมิปัญญาอาหารไทย", rationale: "ใช้โลก วัตถุดิบ และพิธีการ" }], recommended_option_id: "a", allow_custom: true, allow_defer: true } };
}

test("runtime router composes the base director with the provider skill", () => {
  assert.deepEqual(selectRuntimeSkills({ message: "ทำวิดีโอจากไอเดีย" }).skillIds, skillIds);
  assert.equal(selectRuntimeSkills({ message: "เอารูปนี้มาทำให้ขยับ" }).sourceMode, "i2v");
});

test("structured turn requires distinct choices and a recommendation", () => {
  assert.equal(validateCoachTurn(validQuestion(), { requiredSkillIds: skillIds }).ok, true);
  const duplicate = validQuestion(); duplicate.question.options[1].answer = duplicate.question.options[0].answer;
  assert.equal(validateCoachTurn(duplicate, { requiredSkillIds: skillIds }).ok, false);
});

test("FLUX.3 dry-run validator rejects execution metadata", () => {
  const payload = createFlux3DryRunPayload({ prompt: "A hand places a bowl on a Thai kitchen table.", durationSeconds: 8, aspectRatio: "9:16" });
  assert.equal(validateFlux3Payload(payload).ok, true); assert.equal(payload.draft, true); assert.equal(Object.hasOwn(payload, "api_key"), false);
  assert.equal(validateFlux3Payload({ ...payload, polling_url: "https://example.test" }).ok, false);
});

test("Coach Brain uses one repair pass when the first response fails validation", async () => {
  const outputs = ["not json", JSON.stringify(validQuestion())]; let calls = 0;
  const result = await runCoachBrain({ engine: { complete: async () => { calls += 1; return outputs.shift(); } }, skillContext: "trusted test skill", skillIds, providerSkillId: "create-flux3-video", sourceModeHint: "t2v", session: { creativeBrief: {}, messages: [] }, message: "อยากทำโฆษณาน้ำพริก" });
  assert.equal(calls, 2); assert.equal(result.repaired, true); assert.equal(result.turn.question.options.length, 2);
});

test("Coach Brain returns a validated fallback without a third model call", async () => {
  let calls = 0;
  const result = await runCoachBrain({ engine: { complete: async () => { calls += 1; return "broken"; } }, skillContext: "trusted test skill", skillIds, providerSkillId: "create-flux3-video", sourceModeHint: "t2v", session: { creativeBrief: {}, messages: [] }, message: "หนังสั้นร้านกาแฟ" });
  assert.equal(calls, 2); assert.equal(result.fallback, true); assert.equal(validateCoachTurn(result.turn, { requiredSkillIds: skillIds }).ok, true);
});

test("Coach Brain contains an empty provider response instead of failing the chat request", async () => {
  let calls = 0;
  const result = await runCoachBrain({
    engine: { complete: async () => { calls += 1; throw new Error("Prompt Engine returned no content"); } },
    skillContext: "trusted test skill",
    skillIds,
    providerSkillId: "create-flux3-video",
    sourceModeHint: "t2v",
    session: { creativeBrief: {}, messages: [] },
    message: "หนังสั้นร้านกาแฟ",
  });
  assert.equal(calls, 1);
  assert.equal(result.fallback, true);
  assert.equal(validateCoachTurn(result.turn, { requiredSkillIds: skillIds }).ok, true);
});

test("Coach Brain skips the repair call after the response-time budget is spent", async () => {
  let calls = 0;
  let clock = 0;
  const result = await runCoachBrain({
    engine: { complete: async () => { calls += 1; clock = 20_000; return "not json"; } },
    skillContext: "trusted test skill",
    skillIds,
    providerSkillId: "create-flux3-video",
    sourceModeHint: "t2v",
    session: { creativeBrief: {}, messages: [] },
    message: "หนังสั้นร้านกาแฟ",
    now: () => clock,
    repairBudgetMs: 18_000,
  });
  assert.equal(calls, 1);
  assert.equal(result.repaired, false);
  assert.equal(result.fallback, true);
});
