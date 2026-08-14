import crypto from "crypto";

export interface GeneratedTokenPair {
  rawToken: string;
  tokenHash: string;
}

/**
 * Generates a cryptographically secure random 32-byte hex token
 * and returns both the raw token (to send to customer) and its SHA-256 hash (to store in DB).
 */
export function generateQuestionnaireToken(): GeneratedTokenPair {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashQuestionnaireToken(rawToken);
  return { rawToken, tokenHash };
}

/**
 * Computes a SHA-256 hash of a raw questionnaire token string.
 */
export function hashQuestionnaireToken(rawToken: string): string {
  if (!rawToken) {
    throw new Error("Cannot hash an empty token string");
  }
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Performs a constant-time comparison between a candidate raw token's hash
 * and an expected SHA-256 hash stored in the database.
 */
export function verifyQuestionnaireToken(rawToken: string, expectedHash: string): boolean {
  if (!rawToken || !expectedHash) return false;

  const candidateHash = hashQuestionnaireToken(rawToken);

  const candidateBuf = Buffer.from(candidateHash, "hex");
  const expectedBuf = Buffer.from(expectedHash, "hex");

  if (candidateBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateBuf, expectedBuf);
}
