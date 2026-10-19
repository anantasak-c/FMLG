import assert from "node:assert/strict";
import test from "node:test";
import { startGuestCoachSession } from "../src/coach/guest-session.js";
import { answerAdaptiveGrill, confirmCreativeBrief, nextAdaptiveGrillRound } from "../src/coach/ai-coach-workflow.js";

test("Adaptive Grill asks one highest-priority question at a time", () => {
  const round = nextAdaptiveGrillRound(startGuestCoachSession({ idea: "โฆษณาอาหารทะเล" }));
  assert.deepEqual(round.questions.map((question) => question.id), ["publishingTarget"]);
  assert.equal(round.questions[0].choices.length, 3);
  assert.equal(round.questions[0].choices[0].recommended, true);
});

test("a sufficient opening brief is ready without a fixed question count", () => {
  const session = startGuestCoachSession({ idea: "โฆษณาอาหารทะเล", promise: "สดและพรีเมียม", publishingTarget: "reels_tiktok", audioChoice: "without_audio" });
  const round = nextAdaptiveGrillRound(session);
  assert.deepEqual(round.questions, []);
  assert.equal(round.readyToGenerate, true);
  assert.equal(round.nextAction, "create-or-adjust");
});

test("audio produces an optional Thai dialogue preview and image mode requires one image", () => {
  let session = startGuestCoachSession({ idea: "ให้ภาพสินค้าเคลื่อนไหว", promise: "ดูพรีเมียม", publishingTarget: "facebook_post", sourceMode: "image_to_video", audioChoice: "with_audio" });
  assert.equal(nextAdaptiveGrillRound(session).questions[0].id, "dialoguePreview");
  session = answerAdaptiveGrill(session, { dialoguePreview: "สดจากทะเลไทย" });
  assert.equal(nextAdaptiveGrillRound(session).questions[0].id, "sourceImage");
  session = answerAdaptiveGrill(session, { sourceImage: "ภาพสินค้าของฉัน" });
  assert.equal(nextAdaptiveGrillRound(session).readyToGenerate, true);
  assert.match(nextAdaptiveGrillRound(session).lockedSummary, /สดจากทะเลไทย/);
});

test("a visitor can confirm a ready Creative Brief", () => {
  const session = startGuestCoachSession({ idea: "หนังสั้นผีไทย", promise: "น่ากลัว", publishingTarget: "youtube_large_screen", audioChoice: "without_audio" });
  const confirmed = confirmCreativeBrief(session);
  assert.equal(confirmed.creativeBrief.confirmed, true);
  assert.match(confirmed.confirmationSummary, /หนังสั้นผีไทย/);
});

test("the Grill lets Image-to-Video return to Text-to-Video when no image is available", () => {
  const session = answerAdaptiveGrill(startGuestCoachSession({ sourceMode: "image_to_video" }), { sourceImage: "__switch_to_text__" });
  assert.equal(session.creativeBrief.sourceMode, "text_to_video");
});
