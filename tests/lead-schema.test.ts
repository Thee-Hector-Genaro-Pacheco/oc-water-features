import { describe, it, expect } from "vitest";
import { leadSubmissionSchema } from "../src/schemas/lead";

describe("Lead Submission Zod Schema", () => {
  it("should validate a complete, well-formed lead submission", () => {
    const validPayload = {
      fullName: "Jane Doe",
      phone: "(949) 555-0199",
      email: "jane.doe@example.com",
      city: "Irvine",
      serviceAddress: "456 Park Ave",
      propertyType: "Residential",
      serviceRequested: "Fountain Repair",
      message: "Our front fountain stopped flowing water completely yesterday.",
      preferredContactMethod: "Phone",
      website_hp: "",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "fountain_repair_oc",
    };

    const result = leadSubmissionSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
      expect(result.data.utmSource).toBe("google");
    }
  });

  it("should reject an invalid email address", () => {
    const invalidEmailPayload = {
      fullName: "Jane Doe",
      phone: "9495550199",
      email: "not-an-email",
      city: "Irvine",
      propertyType: "Residential",
      serviceRequested: "Fountain Repair",
      message: "Fountain repair message details here.",
      preferredContactMethod: "Phone",
    };

    const result = leadSubmissionSchema.safeParse(invalidEmailPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("should reject when required fields are missing", () => {
    const missingFieldsPayload = {
      email: "jane.doe@example.com",
    };

    const result = leadSubmissionSchema.safeParse(missingFieldsPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.fullName).toBeDefined();
      expect(fieldErrors.phone).toBeDefined();
      expect(fieldErrors.city).toBeDefined();
      expect(fieldErrors.message).toBeDefined();
    }
  });

  it("should detect bot honeypot input", () => {
    const spamPayload = {
      fullName: "Spam Bot",
      phone: "555-555-5555",
      email: "spambot@example.com",
      city: "Spam City",
      propertyType: "Residential",
      serviceRequested: "Fountain Repair",
      message: "Buy cheap products now",
      preferredContactMethod: "Email",
      website_hp: "http://spam-link.com", // Honeypot filled!
    };

    const result = leadSubmissionSchema.safeParse(spamPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      // website_hp is parsed and present, triggering bot handling in handler
      expect(result.data.website_hp).toBe("http://spam-link.com");
    }
  });

  it("should normalize empty or missing UTM parameters", () => {
    const payloadWithoutUTM = {
      fullName: "John Smith",
      phone: "(714) 555-0122",
      email: "john.smith@example.com",
      city: "Anaheim",
      propertyType: "Commercial",
      serviceRequested: "Pond Cleaning",
      message: "Please inspect our commercial koi pond.",
      preferredContactMethod: "Email",
    };

    const result = leadSubmissionSchema.safeParse(payloadWithoutUTM);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.utmSource).toBeUndefined();
      expect(result.data.utmMedium).toBeUndefined();
    }
  });
});
