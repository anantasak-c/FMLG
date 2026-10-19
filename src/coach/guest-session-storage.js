const STORAGE_KEY = "thai-ai-video.guest-coach-session";

export function saveGuestCoachSession(storage, session) {
  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function restoreGuestCoachSession(storage) {
  const rawSession = storage.getItem(STORAGE_KEY);
  return rawSession ? JSON.parse(rawSession) : null;
}
