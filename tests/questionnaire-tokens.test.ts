import { describe, it, expect } from "vitest";
import {
  generateQuestionnaireToken,
  hashQuestionnaireToken,
  verifyQuestionnaireToken,
} from "../src/lib/questionnaire/tokens";

describe("Questionnaire Token Utilities", () => {
  it("should generate a secure questionnaire token pair", () => {
    const { rawToken, tokenHash } = generateQuestionnaireToken();
    expect(rawToken).toBeDefined();
    expect(tokenHash).toBeDefined();
    expect(rawToken.length).toBe(64);
    expect(tokenHash.length).toBe(64);
  });

  it("should enforce hashing consistency for identical inputs", () => {
    const rawToken = "a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef";
    expect(hashQuestionnaireToken(rawToken)).toBe(hashQuestionnaireToken(rawToken));
  });

  it("should ensure raw token is strictly different from stored hash", () => {
    const { rawToken, tokenHash } = generateQuestionnaireToken();
    expect(rawToken).not.toBe(tokenHash);
  });

  it("should perform timing-safe token verification correctly", () => {
    const { rawToken, tokenHash } = generateQuestionnaireToken();
    expect(verifyQuestionnaireToken(rawToken, tokenHash)).toBe(true);
    expect(verifyQuestionnaireToken("invalid-raw-token", tokenHash)).toBe(false);
  });

  it("should produce a different token pair on each call (so a rotated token invalidates the old one)", () => {
    const first = generateQuestionnaireToken();
    const second = generateQuestionnaireToken();
    expect(first.rawToken).not.toBe(second.rawToken);
    expect(first.tokenHash).not.toBe(second.tokenHash);
    expect(verifyQuestionnaireToken(first.rawToken, second.tokenHash)).toBe(false);
  });
});
