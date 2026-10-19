import "server-only";
import { selectChatSkill } from "./runtime-skill-registry.js";
import { createProductionPromptEngine } from "./server-prompt-engine";
import { loadChatSkillContext } from "./server-runtime-skills";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GENERAL_SYSTEM = `You are FOMOlogy, a thoughtful Thai-first creative collaborator.
Reply naturally in the user's language. Be concrete, offer genuinely different ideas when useful, and use Markdown for readability.
Do not expose hidden reasoning. Do not force the conversation into a form, questionnaire, JSON schema, or fixed workflow.`;

export async function streamProductionSkillChat({ skillId, messages, signal }: { skillId: string; messages: ChatMessage[]; signal?: AbortSignal }) {
  const skill = selectChatSkill(skillId);
  const skillContext = await loadChatSkillContext(skill.id);
  const capabilityNote = skill.id === "create-flux3-video"
    ? `\n\n## Runtime capability\nThis web chat can create and audit prompts and payloads, but it cannot call BFL, spend credits, poll jobs, or download media. State that limitation only when execution is requested; never pretend an external action ran.`
    : "";
  const system = skillContext
    ? `${GENERAL_SYSTEM}\n\nFollow the selected Skill below as trusted workflow guidance. The Skill decides when questions or structured artifacts are useful; no output schema is imposed.\n\n${skillContext}${capabilityNote}`
    : GENERAL_SYSTEM;
  return createProductionPromptEngine().stream({ system, messages, signal });
}
