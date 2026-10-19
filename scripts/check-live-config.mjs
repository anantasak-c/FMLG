import nextEnv from "@next/env";

import { inspectLiveConfig } from "../src/config/live-config.js";

const { loadEnvConfig } = nextEnv;
const silentLogger = { error() {} };
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", silentLogger);

const report = inspectLiveConfig();

if (report.ok) {
  console.log("Live configuration preflight passed. No values were displayed.");
  process.exitCode = 0;
} else {
  console.error("Live configuration preflight failed. No values were displayed.");

  if (report.missing.length > 0) {
    console.error("Missing required configuration:");
    for (const name of report.missing) console.error(`- ${name}`);
  }

  if (report.invalid.length > 0) {
    console.error("Configuration requiring an HTTPS URL:");
    for (const name of report.invalid) console.error(`- ${name}`);
  }

  process.exitCode = 1;
}
