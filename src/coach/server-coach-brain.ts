import "server-only";
import { runCoachBrain } from "./coach-brain.js";
import { selectRuntimeSkills } from "./runtime-skill-registry.js";
import { createProductionPromptEngine } from "./server-prompt-engine";
import { loadRuntimeSkillContext } from "./server-runtime-skills";

export async function runProductionCoachTurn({ session, message, overrideId = "auto" }: { session: Record<string, any>; message: string; overrideId?: string }) {
  const selection = selectRuntimeSkills({ overrideId, brief: session.creativeBrief, message });
  const skillContext = await loadRuntimeSkillContext(selection.skillIds);
  return runCoachBrain({
    engine: createProductionPromptEngine(),
    skillContext,
    skillIds: selection.skillIds,
    providerSkillId: selection.providerSkillId,
    sourceModeHint: selection.sourceMode,
    session,
    message,
  });
}
