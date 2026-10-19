export class PilotAccessError extends Error {
  constructor(message = "Pilot access could not be established") {
    super(message);
    this.name = "PilotAccessError";
  }
}

/**
 * Resolves access only from a LINE identity that was independently verified by
 * the server. Repositories are server-side ports so tests can stay deterministic.
 */
export async function establishPilotAccess({ verifiedLineIdentity, repository }) {
  if (!verifiedLineIdentity?.lineUserId) throw new PilotAccessError();

  const result = await repository.claimForVerifiedLineIdentity({
    lineUserId: verifiedLineIdentity.lineUserId,
  });

  if (!result?.isAllowlisted) {
    return Object.freeze({ access: "waiting", pilotCreditGranted: false });
  }

  return Object.freeze({
    access: "eligible",
    pilotCreditGranted: Boolean(result.pilotCreditGranted),
  });
}
