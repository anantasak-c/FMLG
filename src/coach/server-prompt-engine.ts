import "server-only";
import { createOpenRouterPromptEngine } from "./openrouter-prompt-engine.js";

let productionEngine: ReturnType<typeof createOpenRouterPromptEngine> | undefined;

export function createProductionPromptEngine() {
  productionEngine ??= createOpenRouterPromptEngine({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: process.env.OPENROUTER_MODEL ?? "openrouter/free",
    fallbackModel: process.env.OPENROUTER_FALLBACK_MODEL ?? "openrouter/free",
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  });
  return productionEngine;
}
