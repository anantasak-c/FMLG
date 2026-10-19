/**
 * Curated, deployable snapshot of VIDEO_PROMPT_KNOWLEDGE_BASE.md (2026-08-21).
 * The source document is intentionally distilled into tagged rules so a prompt
 * package records exactly which knowledge was applied without sending the whole
 * knowledge base to a provider.
 */
export const KNOWLEDGE_BASE_VERSION = "video-prompt-kb-2026-08-21.v1";

const ENTRIES = [
  {
    id: "audience-promise",
    tags: ["core"],
    rules: [
      "Start with the audience promise, not a list of attractive images.",
      "Make every visual, audio, and action detail serve one intended experience.",
    ],
  },
  {
    id: "timeline-and-beats",
    tags: ["core", "timeline"],
    rules: [
      "Treat duration as a budget: use a readable beat sheet with a decisive final frame.",
      "For a major action, specify preparation, contact or evasion, and recovery.",
    ],
  },
  {
    id: "continuity-anchors",
    tags: ["core", "character", "image-to-video"],
    rules: [
      "Lock exact character count, age, costume, signature props, scale, and left-right placement when they matter.",
      "For a supplied image, preserve its identity and visual anchors across the clip.",
    ],
  },
  {
    id: "camera-audio-causality",
    tags: ["camera", "audio", "core"],
    rules: [
      "Give camera movement, shake, focus changes, damage, and sound a physical cause in the scene.",
      "Keep dialogue short enough to be spoken in the allocated beat by a visible speaker.",
    ],
  },
  {
    id: "cultural-specificity",
    tags: ["culture", "core"],
    rules: [
      "Use cultural references as world, material, sound, and performance structure—not generic visual decoration.",
      "Avoid replacing a specific Thai reference with generic Asian or cyberpunk shorthand.",
    ],
  },
  {
    id: "risk-specific-negative-constraints",
    tags: ["negative", "core"],
    rules: [
      "Write negative constraints for the actual risks: genre drift, camera violations, artifacts, identity changes, text, logos, and unsafe content.",
      "Do not ask the generation engine to render typography when post-production can add it reliably.",
    ],
  },
  {
    id: "recovered-footage-exception",
    tags: ["recovered-footage", "camera"],
    rules: [
      "For recovered footage or news styles, every imperfection must have an in-frame cause; do not use cinematic camera grammar.",
    ],
  },
];

export function retrieveKnowledgeForBrief(brief) {
  const tags = new Set(["core", "timeline", "negative"]);
  const text = [brief.idea, brief.format, brief.era, brief.safetyBoundary].filter(Boolean).join(" ").toLowerCase();
  if (brief.sourceMode === "image_to_video") tags.add("image-to-video");
  if (brief.audioChoice === "with_audio") tags.add("audio");
  if (/ข่าว|news|footage|vhs|เทป/.test(text)) tags.add("recovered-footage");
  if (/ไทย|thai|วัด|รามเกียรติ์|vcd|ท้องถิ่น/.test(text)) tags.add("culture");
  if (/กล้อง|camera|documentary|สารคดี/.test(text)) tags.add("camera");
  if (/คน|ตัวละคร|character|หน้า|ชุด/.test(text) || brief.referenceAssets?.length) tags.add("character");

  return ENTRIES.filter((entry) => entry.tags.some((tag) => tags.has(tag))).map((entry) => ({
    id: entry.id,
    rules: entry.rules,
  }));
}
