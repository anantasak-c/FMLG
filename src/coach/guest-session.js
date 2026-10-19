/**
 * @typedef {Object} CreativeBrief
 * @property {string} idea
 * @property {number | null} durationSeconds
 * @property {string} aspectRatio
 * @property {"economy-video"} providerProfile
 * @property {"text_to_video" | "image_to_video"} sourceMode
 * @property {"economy"} generationTier
 * @property {"reels_tiktok" | "facebook_post" | "youtube_large_screen" | null} publishingTarget
 * @property {"with_audio" | "without_audio" | null} audioChoice
 * @property {string | null} dialoguePreview
 * @property {boolean} dialogueDecided
 * @property {string[]} referenceAssets
 * @property {string | null} format
 * @property {string | null} era
 * @property {string | null} safetyBoundary
 * @property {string[]} negativeConstraints
 * @property {string | null} [world]
 * @property {string | null} [characterAnchors]
 * @property {string | null} [cameraAudioLogic]
 * @property {string | null} [timeline]
 * @property {string | null} [finalFrame]
 * @property {string | undefined} [promise]
 * @property {string | undefined} [incitingChange]
 * @property {number | undefined} [requestedBeatCount]
 * @property {boolean | undefined} [confirmed]
 */

/** @type {CreativeBrief} */
const DEFAULT_BRIEF = {
  idea: "",
  durationSeconds: null,
  aspectRatio: "16:9",
  providerProfile: "economy-video",
  sourceMode: "text_to_video",
  generationTier: "economy",
  publishingTarget: null,
  audioChoice: null,
  dialoguePreview: null,
  dialogueDecided: false,
  referenceAssets: [],
  format: null,
  era: null,
  safetyBoundary: null,
  negativeConstraints: [],
  world: null,
  characterAnchors: null,
  cameraAudioLogic: null,
  timeline: null,
  finalFrame: null,
};

/**
 * @param {Partial<CreativeBrief>} [input]
 * @returns {{ kind: "guest-coach-session", aiCoachConsent: boolean, creativeBrief: CreativeBrief }}
 */
export function startGuestCoachSession(input = {}) {
  return {
    kind: "guest-coach-session",
    aiCoachConsent: false,
    creativeBrief: { ...DEFAULT_BRIEF, ...input },
  };
}

/**
 * @param {{ kind: "guest-coach-session", aiCoachConsent: boolean, creativeBrief: CreativeBrief }} session
 * @param {Partial<CreativeBrief>} changes
 * @returns {{ kind: "guest-coach-session", aiCoachConsent: boolean, creativeBrief: CreativeBrief }}
 */
export function updateGuestCoachSession(session, changes) {
  if (session?.kind !== "guest-coach-session") {
    throw new Error("A Guest Coach Session is required.");
  }

  return {
    ...session,
    creativeBrief: { ...session.creativeBrief, ...changes },
  };
}

/**
 * @param {{ kind: "guest-coach-session", aiCoachConsent: boolean, creativeBrief: CreativeBrief }} session
 * Guest consent permits client-side progress and server-side coaching requests.
 * An authenticated LIFF session records the durable consent separately.
 */
export function recordGuestCoachConsent(session) {
  if (session?.kind !== "guest-coach-session") {
    throw new Error("A Guest Coach Session is required.");
  }
  return { ...session, aiCoachConsent: true };
}
