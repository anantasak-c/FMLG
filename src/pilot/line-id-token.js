export class LineIdentityVerificationError extends Error {
  constructor(message = "LINE identity verification failed") {
    super(message);
    this.name = "LineIdentityVerificationError";
  }
}

/**
 * Verifies a LIFF-issued ID token at LINE. The returned LINE user ID comes
 * exclusively from LINE's verified response, never from the browser payload.
 */
export async function verifyLineIdToken({ idToken, channelId, fetcher = fetch }) {
  if (typeof idToken !== "string" || idToken.trim().length === 0) {
    throw new LineIdentityVerificationError("A LINE ID token is required");
  }
  if (typeof channelId !== "string" || channelId.trim().length === 0) {
    throw new LineIdentityVerificationError("LINE channel configuration is missing");
  }

  let response;
  try {
    response = await fetcher("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
    });
  } catch {
    throw new LineIdentityVerificationError();
  }

  if (!response.ok) throw new LineIdentityVerificationError();

  const payload = await response.json();
  if (typeof payload?.sub !== "string" || payload.sub.length === 0) {
    throw new LineIdentityVerificationError();
  }

  return Object.freeze({ lineUserId: payload.sub });
}
