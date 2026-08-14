import { describe, it, expect } from "vitest";
import { questionnaireSubmissionSchema } from "../src/schemas/questionnaire";

const basePayload = {
  serviceRequested: ["Fountain repair"],
  propertyType: "Residential",
  waterFeatureAge: "1-3 years",
  issueDuration: "1-4 weeks",
  operatingCondition: "Works intermittently",
  leakCondition: "No known leak",
  previousServiceStatus: "No",
  maintenanceFrequency: "Monthly",
  preferredContactMethod: "Text message",
  preferredContactTime: "Afternoon",
};

describe("Questionnaire Submission Schema", () => {
  it("accepts a fully valid payload with only the approved values", () => {
    const result = questionnaireSubmissionSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
  });

  it("accepts multiple service selections (service_requested is not single-choice)", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      serviceRequested: ["Fountain repair", "Pump replacement", "Leak diagnosis / leak repair"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serviceRequested).toHaveLength(3);
    }
  });

  it("rejects an empty service_requested array", () => {
    const result = questionnaireSubmissionSchema.safeParse({ ...basePayload, serviceRequested: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a service_requested value outside the approved list", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      serviceRequested: ["Not a real service"],
    });
    expect(result.success).toBe(false);
  });

  it("allows an optional explanation when 'Other' is selected for service_requested", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      serviceRequested: ["Other"],
      serviceRequestedOtherDetail: "Custom decorative wall fountain rewiring",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.serviceRequestedOtherDetail).toBe("Custom decorative wall fountain rewiring");
    }
  });

  it("rejects an invalid propertyType value", () => {
    const result = questionnaireSubmissionSchema.safeParse({ ...basePayload, propertyType: "Spaceship" });
    expect(result.success).toBe(false);
  });

  it("uses 'Not sure' (not 'Unsure') as the approved wording across enums", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      waterFeatureAge: "Not sure",
      issueDuration: "Not sure",
      operatingCondition: "Not sure",
      leakCondition: "Not sure",
      previousServiceStatus: "Not sure",
      maintenanceFrequency: "Not sure",
    });
    expect(result.success).toBe(true);

    const rejected = questionnaireSubmissionSchema.safeParse({ ...basePayload, waterFeatureAge: "Unsure" });
    expect(rejected.success).toBe(false);
  });

  it("includes SMS as a preferred contact method option, not just Phone/Email", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      preferredContactMethod: "Text message",
    });
    expect(result.success).toBe(true);
  });

  it("leaves additionalNotes and previousServiceExplanation optional", () => {
    const result = questionnaireSubmissionSchema.safeParse(basePayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.additionalNotes).toBeUndefined();
      expect(result.data.previousServiceExplanation).toBeUndefined();
    }
  });

  it("enforces a character limit on additionalNotes", () => {
    const result = questionnaireSubmissionSchema.safeParse({
      ...basePayload,
      additionalNotes: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
