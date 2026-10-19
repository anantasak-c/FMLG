import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { verifyLineIdToken } from "../src/pilot/line-id-token.js";
import { establishPilotAccess } from "../src/pilot/pilot-access.js";

test("server accepts the LINE identity returned by LINE verification, not a browser user id", async () => {
  let receivedBody;
  const identity = await verifyLineIdToken({
    idToken: "browser-token",
    channelId: "channel-id",
    fetcher: async (_url, init) => {
      receivedBody = init.body.toString();
      return { ok: true, json: async () => ({ sub: "verified-line-user" }) };
    },
  });

  assert.equal(identity.lineUserId, "verified-line-user");
  assert.match(receivedBody, /id_token=browser-token/);
  assert.match(receivedBody, /client_id=channel-id/);
});

test("unverified or malformed LINE tokens cannot establish pilot access", async () => {
  await assert.rejects(
    verifyLineIdToken({
      idToken: "unverified-token",
      channelId: "channel-id",
      fetcher: async () => ({ ok: false }),
    }),
  );
  await assert.rejects(establishPilotAccess({ verifiedLineIdentity: {}, repository: {} }));
});

test("allowlisted identities receive access while other identities see a waiting state", async () => {
  const repository = {
    async claimForVerifiedLineIdentity({ lineUserId }) {
      return {
        isAllowlisted: lineUserId === "allowlisted-line-user",
        pilotCreditGranted: lineUserId === "allowlisted-line-user",
      };
    },
  };

  assert.deepEqual(
    await establishPilotAccess({
      verifiedLineIdentity: { lineUserId: "allowlisted-line-user" },
      repository,
    }),
    { access: "eligible", pilotCreditGranted: true },
  );
  assert.deepEqual(
    await establishPilotAccess({
      verifiedLineIdentity: { lineUserId: "not-allowlisted" },
      repository,
    }),
    { access: "waiting", pilotCreditGranted: false },
  );
});

test("LIFF never imports or renders compiled provider prompts", async () => {
  const liffShell = await readFile(new URL("../src/app/liff/liff-shell.tsx", import.meta.url), "utf8");
  assert.equal(liffShell.includes("generationPrompt"), false);
  assert.equal(liffShell.includes("negativePrompt"), false);
  assert.equal(liffShell.includes("providerProfile"), false);
});
