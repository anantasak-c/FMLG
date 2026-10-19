import assert from "node:assert/strict";
import test from "node:test";

import { createInMemoryPromptPackageRepository, exportPromptPackage } from "../src/coach/prompt-package-boundary.js";

const confirmedBrief = {
  id: "brief-1",
  ownerId: "creator-a",
  creativeBrief: {
    idea: "หนังสั้นผีไทย",
    promise: "น่ากลัว",
    publishingTarget: "youtube_large_screen",
    audioChoice: "without_audio",
    sourceMode: "text_to_video",
    referenceAssets: [],
    aspectRatio: "16:9",
    durationSeconds: 8,
    negativeConstraints: [],
  },
};

test("an authenticated owner exports an immutable Prompt Package without starting generation", async () => {
  const repository = createInMemoryPromptPackageRepository();
  const result = await exportPromptPackage({ confirmedBrief, ownerId: "creator-a", repository });
  assert.equal(result.ok, true);
  assert.equal(result.promptPackage.providerProfile, "economy-video");
  assert.equal(result.promptPackage.promptPackage.qualityGate.status, "pass");
  assert.equal(await repository.findForOwner("creator-b", result.promptPackage.id), null);
});

test("a user cannot export another owner's brief", async () => {
  const result = await exportPromptPackage({ confirmedBrief, ownerId: "creator-b", repository: createInMemoryPromptPackageRepository() });
  assert.deepEqual(result, { ok: false, message: "ไม่พบ Creative Brief ที่ยืนยันแล้ว" });
});
