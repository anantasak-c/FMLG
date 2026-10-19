import assert from "node:assert/strict";
import test from "node:test";

import {
  startGuestCoachSession,
  recordGuestCoachConsent,
  updateGuestCoachSession,
} from "../src/coach/guest-session.js";
import {
  restoreGuestCoachSession,
  saveGuestCoachSession,
} from "../src/coach/guest-session-storage.js";

test("a visitor can start and update a Guest Coach Session", () => {
  const session = startGuestCoachSession({
    idea: "โฆษณาอาหารทะเล 15 วินาที",
    durationSeconds: 15,
    aspectRatio: "9:16",
  });

  const updated = updateGuestCoachSession(session, {
    format: "Thai luxury TVC",
    safetyBoundary: "no text or logos",
  });

  assert.deepEqual(updated.creativeBrief, {
    idea: "โฆษณาอาหารทะเล 15 วินาที",
    durationSeconds: 15,
    aspectRatio: "9:16",
    providerProfile: "economy-video",
    sourceMode: "text_to_video",
    generationTier: "economy",
    publishingTarget: null,
    audioChoice: null,
    dialoguePreview: null,
    dialogueDecided: false,
    referenceAssets: [],
    format: "Thai luxury TVC",
    era: null,
    safetyBoundary: "no text or logos",
    negativeConstraints: [],
    world: null,
    characterAnchors: null,
    cameraAudioLogic: null,
    timeline: null,
    finalFrame: null,
  });
});

test("a visitor can record the AI Coach consent before a live coaching request", () => {
  assert.equal(recordGuestCoachConsent(startGuestCoachSession()).aiCoachConsent, true);
});

test("a visitor's Guest Coach Session is retained in browser session storage", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const session = startGuestCoachSession({ idea: "หนังสั้นผีไทย" });

  saveGuestCoachSession(storage, session);

  assert.deepEqual(restoreGuestCoachSession(storage), session);
});
