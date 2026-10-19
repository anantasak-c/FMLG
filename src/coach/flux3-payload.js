const ASPECT_RATIOS = new Set(["auto", "21:9", "2:1", "16:9", "4:3", "1:1", "3:4", "9:16"]);
const COMMON_FIELDS = new Set(["prompt", "mode", "aspect_ratio", "duration", "resolution", "version", "generate_audio", "safety_tolerance", "draft"]);
const MODE_FIELDS = {
  t2v: new Set(),
  i2v: new Set(["keyframes"]),
  v2v: new Set(["start_video"]),
  draft_enhance: new Set(["draft_cache"]),
};

export function validateFlux3Payload(payload, { pilotOnly = true } = {}) {
  const errors = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { ok: false, errors: ["payload must be an object"] };
  const mode = payload.mode;
  if (!MODE_FIELDS[mode]) errors.push("mode must be t2v, i2v, v2v, or draft_enhance");
  if (pilotOnly && !["t2v", "i2v"].includes(mode)) errors.push("customer pilot supports only t2v and i2v");
  if (typeof payload.prompt !== "string" || !payload.prompt.trim()) errors.push("prompt is required");
  if (payload.aspect_ratio !== undefined && !ASPECT_RATIOS.has(payload.aspect_ratio)) errors.push("aspect_ratio is invalid");
  if (payload.duration !== undefined && payload.duration !== "auto") {
    const max = mode === "v2v" ? 15 : 20;
    if (!Number.isInteger(payload.duration) || payload.duration < 5 || payload.duration > max) errors.push(`duration must be a whole second from 5 to ${max}`);
  }
  if (payload.resolution !== undefined && !["hd", "fhd"].includes(payload.resolution)) errors.push("resolution must be hd or fhd");
  if (payload.version !== undefined && payload.version !== "latest") errors.push("version must be latest");
  if (payload.generate_audio !== undefined && typeof payload.generate_audio !== "boolean") errors.push("generate_audio must be boolean");
  if (payload.draft !== undefined && typeof payload.draft !== "boolean") errors.push("draft must be boolean");
  if (payload.safety_tolerance !== undefined && (!Number.isInteger(payload.safety_tolerance) || payload.safety_tolerance < 0 || payload.safety_tolerance > 4)) errors.push("safety_tolerance must be an integer from 0 to 4");

  const allowed = new Set([...COMMON_FIELDS, ...(MODE_FIELDS[mode] ?? [])]);
  for (const key of Object.keys(payload)) if (!allowed.has(key)) errors.push(`${key} is not allowed for ${mode ?? "this mode"}`);

  if (mode === "i2v") {
    if (!Array.isArray(payload.keyframes) || payload.keyframes.length !== 1) errors.push("pilot i2v requires exactly one keyframe");
    else {
      const frame = payload.keyframes[0];
      if (!Array.isArray(frame) || frame.length !== 2 || frame[0] !== 0 || typeof frame[1] !== "string" || !frame[1].trim()) errors.push("i2v keyframe must be [0, sourceImage]");
    }
  }
  if (mode === "v2v" && (typeof payload.start_video !== "string" || !payload.start_video.trim())) errors.push("v2v requires start_video");
  if (mode === "draft_enhance") {
    if (typeof payload.draft_cache !== "string" || !payload.draft_cache.trim()) errors.push("draft_enhance requires draft_cache");
    if (payload.draft === true) errors.push("draft_enhance cannot request another draft");
  }

  return { ok: errors.length === 0, errors };
}

export function createFlux3DryRunPayload({ prompt, sourceMode = "t2v", sourceImage, durationSeconds = 8, aspectRatio = "9:16", generateAudio = true, finalRender = false }) {
  const payload = {
    prompt,
    mode: sourceMode,
    aspect_ratio: aspectRatio,
    duration: durationSeconds,
    resolution: finalRender ? "fhd" : "hd",
    version: "latest",
    generate_audio: generateAudio,
    safety_tolerance: 2,
    draft: !finalRender,
    ...(sourceMode === "i2v" ? { keyframes: [[0, sourceImage]] } : {}),
  };
  const validation = validateFlux3Payload(payload);
  if (!validation.ok) throw new Error(validation.errors.join("; "));
  return payload;
}
