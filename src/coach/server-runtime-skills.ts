import "server-only";
import { readFile } from "node:fs/promises";

const FILES: Record<string, URL[]> = {
  "video-creative-director": [
    new URL("./runtime-skills/video-creative-director/SKILL.md", import.meta.url),
    new URL("./runtime-skills/video-creative-director/references/direction.md", import.meta.url),
  ],
  "create-flux3-video": [
    new URL("./runtime-skills/create-flux3-video/SKILL.md", import.meta.url),
    new URL("./runtime-skills/create-flux3-video/references/direction.md", import.meta.url),
    new URL("./runtime-skills/create-flux3-video/references/flux3-api.md", import.meta.url),
  ],
};

export async function loadRuntimeSkillContext(skillIds: string[]) {
  const sections = await Promise.all(skillIds.map(async (skillId) => {
    const files = FILES[skillId];
    if (!files) throw new Error(`Unknown runtime skill: ${skillId}`);
    const content = await Promise.all(files.map((file) => readFile(file, "utf8")));
    return `## Runtime skill: ${skillId}\n\n${content.join("\n\n")}`;
  }));
  return sections.join("\n\n---\n\n");
}

export async function loadChatSkillContext(skillId: string) {
  if (skillId === "general") return "";
  return loadRuntimeSkillContext([skillId]);
}
