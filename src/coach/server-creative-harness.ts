import "server-only";

import { compilePromptPackage } from "./creative-harness.js";

/**
 * The external interface deliberately omits compiled provider prompts. Advanced
 * Prompt View receives the persisted immutable package in Ticket 08 instead.
 */
export function createCreatorSafePreview(brief: Record<string, unknown>) {
  const promptPackage = compilePromptPackage(brief);
  return {
    creativeBrief: promptPackage.thaiSummary,
    dialogueSheet: promptPackage.dialogueSheet,
    continuityChecklist: promptPackage.continuityChecklist,
    qualityGate: promptPackage.qualityGate,
    knowledgeBaseVersion: promptPackage.knowledgeBaseVersion,
    knowledgeEntries: promptPackage.knowledgeEntries,
    assumptions: promptPackage.assumptions,
    generation: {
      tier: "ประหยัด",
      coinCost: 1,
      sourceMode: promptPackage.thaiSummary.sourceMode,
    },
  };
}
