const REGISTRY = {
  "economy-video": {
    id: "economy-video",
    creatorTier: "economy",
    creatorLabel: "ประหยัด",
    sourceModes: ["text_to_video", "image_to_video"],
    requiredBriefFields: ["idea", "promise", "publishingTarget", "audioChoice"],
    knowledgeTags: ["core", "timeline", "negative"],
    visibleOptions: {
      durationSeconds: 8,
      aspectRatioByTarget: {
        reels_tiktok: "9:16",
        facebook_post: "1:1",
        youtube_large_screen: "16:9",
      },
    },
    qualityLimits: {
      maxBeatsForEightSeconds: 2,
      exactlyOneReferenceImage: true,
    },
  },
};

export function selectCoachSkill(brief) {
  if (brief?.generationTier && brief.generationTier !== "economy") {
    throw new Error("The selected generation tier is not available in this pilot.");
  }
  if (brief?.sourceMode && !REGISTRY["economy-video"].sourceModes.includes(brief.sourceMode)) {
    throw new Error("The selected source mode is not available in this pilot.");
  }
  return REGISTRY["economy-video"];
}

export function applySkillDefaults(brief) {
  const skill = selectCoachSkill(brief);
  const aspectRatio = skill.visibleOptions.aspectRatioByTarget[brief.publishingTarget] ?? brief.aspectRatio;
  return {
    ...brief,
    providerProfile: skill.id,
    generationTier: skill.creatorTier,
    durationSeconds: brief.durationSeconds ?? skill.visibleOptions.durationSeconds,
    aspectRatio,
  };
}
