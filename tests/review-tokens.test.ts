import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  generateReviewToken,
  hashReviewToken,
  verifyReviewToken,
} from "../src/lib/reviews/tokens";

const reviewSubmitTestSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(5),
  displayName: z.string().min(2),
  city: z.string().min(2),
  permissionToPublish: z.boolean().default(false),
});

describe("Review Token Utilities & Rating Schema", () => {
  it("should generate a secure review token pair", () => {
    const { rawToken, tokenHash } = generateReviewToken();
    expect(rawToken).toBeDefined();
    expect(tokenHash).toBeDefined();
    expect(rawToken.length).toBe(64); // 32 bytes in hex = 64 chars
    expect(tokenHash.length).toBe(64); // SHA-256 in hex = 64 chars
  });

  it("should enforce hashing consistency for identical inputs", () => {
    const rawToken = "a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef";
    const hash1 = hashReviewToken(rawToken);
    const hash2 = hashReviewToken(rawToken);
    expect(hash1).toBe(hash2);
  });

  it("should ensure raw token is strictly different from stored hash", () => {
    const { rawToken, tokenHash } = generateReviewToken();
    expect(rawToken).not.toBe(tokenHash);
  });

  it("should perform timing-safe token verification correctly", () => {
    const { rawToken, tokenHash } = generateReviewToken();
    const isValid = verifyReviewToken(rawToken, tokenHash);
    expect(isValid).toBe(true);

    const isInvalid = verifyReviewToken("invalid-raw-token", tokenHash);
    expect(isInvalid).toBe(false);
  });

  it("should enforce rating between 1 and 5 stars", () => {
    const valid5Star = reviewSubmitTestSchema.safeParse({
      rating: 5,
      reviewText: "Outstanding water feature repair service!",
      displayName: "Mark T.",
      city: "Fullerton",
    });
    expect(valid5Star.success).toBe(true);

    const invalid0Star = reviewSubmitTestSchema.safeParse({
      rating: 0,
      reviewText: "Terrible service",
      displayName: "Mark T.",
      city: "Fullerton",
    });
    expect(invalid0Star.success).toBe(false);

    const invalid6Star = reviewSubmitTestSchema.safeParse({
      rating: 6,
      reviewText: "Over the top",
      displayName: "Mark T.",
      city: "Fullerton",
    });
    expect(invalid6Star.success).toBe(false);
  });

  it("should leave publish permission optional (defaulting to false)", () => {
    const parsedWithoutPermission = reviewSubmitTestSchema.safeParse({
      rating: 4,
      reviewText: "Great pond cleanout.",
      displayName: "David K.",
      city: "Mission Viejo",
    });

    expect(parsedWithoutPermission.success).toBe(true);
    if (parsedWithoutPermission.success) {
      expect(parsedWithoutPermission.data.permissionToPublish).toBe(false);
    }

    const parsedWithPermission = reviewSubmitTestSchema.safeParse({
      rating: 5,
      reviewText: "Great pond cleanout.",
      displayName: "David K.",
      city: "Mission Viejo",
      permissionToPublish: true,
    });

    expect(parsedWithPermission.success).toBe(true);
    if (parsedWithPermission.success) {
      expect(parsedWithPermission.data.permissionToPublish).toBe(true);
    }
  });
});
