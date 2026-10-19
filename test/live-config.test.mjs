import assert from "node:assert/strict";
import test from "node:test";

import { inspectLiveConfig, LIVE_CONFIG_REQUIREMENTS } from "../src/config/live-config.js";

function validEnvironment() {
  return Object.fromEntries(
    LIVE_CONFIG_REQUIREMENTS.map(({ name, requiresHttps }) => [
      name,
      requiresHttps ? "https://example.test" : "configured-for-test",
    ]),
  );
}

test("live configuration inspection returns names, never values", () => {
  const environment = validEnvironment();
  environment.BFL_API_KEY = "private-value-that-must-not-appear";
  delete environment.LINE_LOGIN_CHANNEL_SECRET;

  const report = inspectLiveConfig(environment);

  assert.deepEqual(report.missing, ["LINE_LOGIN_CHANNEL_SECRET"]);
  assert.deepEqual(report.invalid, []);
  assert.equal(JSON.stringify(report).includes(environment.BFL_API_KEY), false);
});

test("live configuration inspection requires HTTPS for public URLs", () => {
  const environment = validEnvironment();
  environment.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

  const report = inspectLiveConfig(environment);

  assert.equal(report.ok, false);
  assert.deepEqual(report.invalid, ["NEXT_PUBLIC_APP_URL"]);
});
