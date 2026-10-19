import assert from "node:assert/strict";
import test from "node:test";

import { confirmCreativeBrief } from "../src/coach/ai-coach-workflow.js";
import { startGuestCoachSession } from "../src/coach/guest-session.js";
import {
  createInMemoryConfirmedBriefRepository,
  persistConfirmedCreativeBrief,
} from "../src/coach/authenticated-brief-boundary.js";

function confirmedSession() {
  return confirmCreativeBrief(startGuestCoachSession({
    idea: "หนังสั้นผีไทย",
    promise: "น่ากลัว",
    durationSeconds: 8,
  }));
}

test("simulated sign-in persists a confirmed Guest Coach Session for its owner", async () => {
  const repository = createInMemoryConfirmedBriefRepository();

  const result = await persistConfirmedCreativeBrief({
    session: confirmedSession(),
    simulatedUserId: "creator-a",
    repository,
  });

  assert.equal(result.ok, true);
  assert.equal(result.confirmedBrief.ownerId, "creator-a");
  assert.equal(result.confirmedBrief.creativeBrief.idea, "หนังสั้นผีไทย");
  assert.equal((await repository.listForOwner("creator-a")).length, 1);
});

test("one simulated user cannot read another user's Confirmed Creative Brief", async () => {
  const repository = createInMemoryConfirmedBriefRepository();
  const saved = await persistConfirmedCreativeBrief({ session: confirmedSession(), simulatedUserId: "creator-a", repository });

  assert.equal(await repository.findForOwner("creator-b", saved.confirmedBrief.id), null);
});

test("persistence failure returns user-visible state without a partial Confirmed Creative Brief", async () => {
  const repository = {
    async create() { throw new Error("Database unavailable"); },
    async listForOwner() { return []; },
  };

  const result = await persistConfirmedCreativeBrief({ session: confirmedSession(), simulatedUserId: "creator-a", repository });

  assert.deepEqual(result, { ok: false, message: "บันทึก Creative Brief ไม่สำเร็จ กรุณาลองอีกครั้ง" });
  assert.equal((await repository.listForOwner("creator-a")).length, 0);
});
