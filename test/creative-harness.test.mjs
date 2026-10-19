import assert from "node:assert/strict";
import test from "node:test";

import { compilePromptPackage, evaluateQualityGate, prepareCreativeBrief } from "../src/coach/creative-harness.js";

const readyBrief = {
  idea: "โฆษณาข้าวไทยที่นึ่งใหม่จากหม้อ",
  promise: "พรีเมียมและน่าจดจำ",
  publishingTarget: "reels_tiktok",
  audioChoice: "with_audio",
  dialogueDecided: true,
  dialoguePreview: "หอมทุกคำจากข้าวไทย",
  sourceMode: "text_to_video",
  referenceAssets: [],
  aspectRatio: "16:9",
  durationSeconds: null,
  safetyBoundary: "ไม่มีโลโก้",
  negativeConstraints: [],
};

test("Creative Harness selects the Economy skill, applies KB provenance, and defaults for the publishing target", () => {
  const prepared = prepareCreativeBrief(readyBrief);
  assert.equal(prepared.creativeBrief.providerProfile, "economy-video");
  assert.equal(prepared.creativeBrief.aspectRatio, "9:16");
  assert.equal(prepared.creativeBrief.durationSeconds, 8);
  assert.match(prepared.creativeBrief.timeline, /0-4s/);
  assert.match(prepared.creativeBrief.finalFrame, /พรีเมียม/);
  assert.match(prepared.knowledgeBaseVersion, /^video-prompt-kb-/);
  assert.ok(prepared.knowledgeEntries.includes("audience-promise"));
});

test("Prompt Package has risk-specific negative constraints and a quality gate", () => {
  const promptPackage = compilePromptPackage(readyBrief);
  assert.match(promptPackage.generationPrompt, /Thai dialogue/);
  assert.match(promptPackage.generationPrompt, /WORLD \/ LOCATION/);
  assert.match(promptPackage.negativePrompt, /ไม่มีโลโก้/);
  assert.equal(promptPackage.qualityGate.status, "pass");
  assert.equal(promptPackage.dialogueSheet[0].text, "หอมทุกคำจากข้าวไทย");
});

test("Image-to-Video blocks multiple reference images and platform policy blocks sexual content involving minors", () => {
  assert.equal(evaluateQualityGate({ ...readyBrief, sourceMode: "image_to_video", referenceAssets: ["one", "two"] }).status, "block");
  assert.equal(evaluateQualityGate({ ...readyBrief, idea: "เนื้อหาเพศกับผู้เยาว์" }).status, "block");
});

test("the package separates creator-visible summary from the compiled provider prompts", () => {
  const promptPackage = compilePromptPackage(readyBrief);
  const { generationPrompt, negativePrompt, ...creatorSafeFields } = promptPackage;
  const text = JSON.stringify(creatorSafeFields);
  assert.equal(text.includes("generationPrompt"), false);
  assert.equal(text.includes("negativePrompt"), false);
  assert.match(generationPrompt, /Create an/);
  assert.match(negativePrompt, /identity/);
});
