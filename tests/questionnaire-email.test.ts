import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockSend = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(function MockResend() {
      return { emails: { send: mockSend } };
    }),
  };
});

import { sendQuestionnaireInvite } from "../src/lib/email/sendQuestionnaireInvite";
import { sendQuestionnaireCompletionNotification } from "../src/lib/email/sendQuestionnaireCompletionNotification";
import { sendQuestionnaireConfirmation } from "../src/lib/email/sendQuestionnaireConfirmation";

const RAW_TOKEN = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678";

describe("Questionnaire Email Notifications", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    mockSend.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM_ADDRESS;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe("sendQuestionnaireInvite", () => {
    const payload = {
      leadId: "lead-1",
      leadName: "Jane Doe",
      leadEmail: "jane@example.com",
      rawToken: RAW_TOKEN,
    };

    it("uses dev-logger mode (not 'sent') when Resend is unconfigured", async () => {
      const result = await sendQuestionnaireInvite(payload);
      expect(result.deliveryMode).toBe("dev_logger");
      expect(result.link).toContain(RAW_TOKEN);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("marks deliveryMode 'sent' only on a real, successful Resend send", async () => {
      process.env.RESEND_API_KEY = "test-key-not-real";
      process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
      mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null });

      const result = await sendQuestionnaireInvite(payload);
      expect(result.deliveryMode).toBe("sent");
      expect(mockSend).toHaveBeenCalledTimes(1);
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.to).toBe("jane@example.com");
      expect(callArgs.text).toContain(RAW_TOKEN);
    });

    it("marks deliveryMode 'failed' (not 'sent') on a provider error", async () => {
      process.env.RESEND_API_KEY = "test-key-not-real";
      process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
      mockSend.mockResolvedValue({ data: null, error: { message: "Simulated outage" } });

      const result = await sendQuestionnaireInvite(payload);
      expect(result.deliveryMode).toBe("failed");
    });

    it("never logs the raw token", async () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      await sendQuestionnaireInvite(payload);
      const loggedText = logSpy.mock.calls.map((c) => JSON.stringify(c)).join(" ");
      expect(loggedText).not.toContain(RAW_TOKEN);
      logSpy.mockRestore();
    });
  });

  describe("sendQuestionnaireCompletionNotification", () => {
    const payload = {
      leadId: "lead-1",
      leadName: "Jane Doe",
      serviceRequested: ["Fountain repair", "Pump replacement"],
      propertyType: "Residential",
      submittedAt: new Date().toISOString(),
    };

    it("notifies both business and admin recipients", async () => {
      const result = await sendQuestionnaireCompletionNotification(payload);
      expect(result.recipients).toContain("ocwaterfeatures@live.com");
      expect(result.recipients).toContain("hect24pacheco@gmail.com");
      expect(result.deliveryMode).toBe("dev_logger");
    });

    it("sends via Resend when configured (mocked)", async () => {
      process.env.RESEND_API_KEY = "test-key-not-real";
      process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
      mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null });

      const result = await sendQuestionnaireCompletionNotification(payload);
      expect(result.deliveryMode).toBe("sent");
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.text).toContain("Fountain repair, Pump replacement");
    });
  });

  describe("sendQuestionnaireConfirmation", () => {
    const payload = { customerName: "Jane Doe", customerEmail: "jane@example.com" };

    it("uses dev-logger mode when Resend is unconfigured", async () => {
      const result = await sendQuestionnaireConfirmation(payload);
      expect(result.deliveryMode).toBe("dev_logger");
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("tells the customer they may reply with photos", async () => {
      process.env.RESEND_API_KEY = "test-key-not-real";
      process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
      mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null });

      const result = await sendQuestionnaireConfirmation(payload);
      expect(result.deliveryMode).toBe("sent");
      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs.text).toContain("reply to this email with the photos attached");
    });

    it("marks deliveryMode 'failed' on a network-level exception, without throwing", async () => {
      process.env.RESEND_API_KEY = "test-key-not-real";
      process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
      mockSend.mockRejectedValue(new Error("Simulated network failure"));

      await expect(sendQuestionnaireConfirmation(payload)).resolves.toMatchObject({
        success: false,
        deliveryMode: "failed",
      });
    });
  });
});
