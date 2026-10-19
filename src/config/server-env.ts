import "server-only";

import { inspectLiveConfig } from "./live-config.js";

export class LiveConfigurationError extends Error {
  constructor(
    public readonly missing: readonly string[],
    public readonly invalid: readonly string[],
  ) {
    super("Live configuration preflight failed. See missing and invalid names.");
    this.name = "LiveConfigurationError";
  }
}

/**
 * Server-only guard for integrations that require customer-pilot credentials.
 * Its error carries names only and never includes a configuration value.
 */
export function requireLiveConfig(environment: NodeJS.ProcessEnv = process.env): void {
  const report = inspectLiveConfig(environment);

  if (!report.ok) {
    throw new LiveConfigurationError(report.missing, report.invalid);
  }
}
