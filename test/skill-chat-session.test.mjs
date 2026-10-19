import assert from "node:assert/strict";
import test from "node:test";
import { appendChatMessage, chooseCoachSkill, createChatHistory, restoreCoachChatSession, startCoachChatSession } from "../src/coach/coach-chat-session.js";
import { selectChatSkill } from "../src/coach/runtime-skill-registry.js";

test("a new skill chat locks one selected skill", () => {
  const empty = startCoachChatSession();
  const selected = chooseCoachSkill(empty, "create-flux3-video");
  assert.equal(selected.selectedSkillId, "create-flux3-video");
  assert.equal(selected.messages.length, 1);
  assert.equal(chooseCoachSkill(selected, "general").selectedSkillId, "create-flux3-video");
  assert.equal(selectChatSkill("general").kind, "general");
  assert.throws(() => selectChatSkill("video-creative-director"), /Unknown chat skill/);
});

test("chat history contains only valid completed conversation text", () => {
  let session = chooseCoachSkill(startCoachChatSession(), "general");
  [session] = appendChatMessage(session, { role: "user", text: "ช่วยคิดชื่อ" });
  [session] = appendChatMessage(session, { role: "assistant", text: "ได้เลย", status: "complete" });
  [session] = appendChatMessage(session, { role: "assistant", text: "", status: "error" });
  assert.deepEqual(createChatHistory(session).slice(-2), [{ role: "user", content: "ช่วยคิดชื่อ" }, { role: "assistant", content: "ได้เลย" }]);
});

test("version 1 Coach sessions migrate messages without Creative Brief state", () => {
  const migrated = restoreCoachChatSession({ kind: "coach-chat-session", version: 1, aiCoachConsent: true, creativeBrief: { idea: "legacy" }, messages: [{ role: "user", text: "ไอเดียเดิม" }] });
  assert.equal(migrated.kind, "skill-chat-session");
  assert.equal(migrated.version, 2);
  assert.equal(migrated.selectedSkillId, "create-flux3-video");
  assert.equal(Object.hasOwn(migrated, "creativeBrief"), false);
  assert.equal(migrated.messages[0].text, "ไอเดียเดิม");
});
