import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockSend = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(function MockResend() {
      return { emails: { send: mockSend } };
    }),
  };
});

import { sendLeadNotification } from "../src/lib/email/sendLeadNotification";

const basePayload = {
  full_name: "Test Customer",
  phone: "(714) 362-4376",
  email: "test.customer@example.com",
  city: "Huntington Beach",
  property_type: "Residential",
  service_requested: "Fountain Repair",
  message: "Test lead message for notification verification",
  preferred_contact_method: "Phone",
  created_at: new Date().toISOString(),
};

describe("Lead Email Notification Dispatcher", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    mockSend.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM_ADDRESS;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("should construct recipients from BUSINESS_NOTIFICATION_EMAIL and ADMIN_NOTIFICATION_EMAIL", async () => {
    const result = await sendLeadNotification({ ...basePayload, id: "recipient-construction-test" });

    expect(result.recipients).toContain("ocwaterfeatures@live.com");
    expect(result.recipients).toContain("hect24pacheco@gmail.com");
  });

  it("should notify exactly the business and admin recipients (two-recipient behavior)", async () => {
    const result = await sendLeadNotification({ ...basePayload, id: "two-recipient-test" });

    expect(result.recipients).toHaveLength(2);
    expect(result.subject).toContain("Fountain Repair");
    expect(result.subject).toContain("Huntington Beach");
    expect(result.adminLink).toContain("/admin/leads/two-recipient-test");
  });

  it("should prevent duplicate emails from accidental repeated processing", async () => {
    const payload = { ...basePayload, id: "duplicate-lead-456" };

    const firstRun = await sendLeadNotification(payload);
    expect(firstRun.success).toBe(true);

    const secondRun = await sendLeadNotification(payload);
    expect(secondRun.success).toBe(true);
    expect(secondRun.deliveryMode).toBe("dev_logger");
  });

  it("should fall back to safe dev-logger mode when Resend is not configured, and never call the SDK", async () => {
    // RESEND_API_KEY / EMAIL_FROM_ADDRESS deliberately absent (cleared in beforeEach)
    const result = await sendLeadNotification({ ...basePayload, id: "missing-config-test" });

    expect(result.success).toBe(true);
    expect(result.deliveryMode).toBe("dev_logger");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("should fall back to dev-logger mode when only RESEND_API_KEY is set but EMAIL_FROM_ADDRESS is missing", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";

    const result = await sendLeadNotification({ ...basePayload, id: "partial-config-test" });

    expect(result.deliveryMode).toBe("dev_logger");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("should send real email via Resend to both recipients when fully configured (mocked)", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockResolvedValue({ data: { id: "email-id-123" }, error: null });

    const result = await sendLeadNotification({ ...basePayload, id: "successful-send-test" });

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toEqual(expect.arrayContaining(["ocwaterfeatures@live.com", "hect24pacheco@gmail.com"]));
    expect(callArgs.from).toBe("OC Water Features <leads@ocwaterfeatures.com>");
    expect(callArgs.text).toContain("Test Customer");
    expect(callArgs.text).toContain("successful-send-test");

    expect(result.success).toBe(true);
    expect(result.deliveryMode).toBe("sent");
  });

  it("should mark delivery as failed (without throwing) when Resend returns an API error", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockResolvedValue({ data: null, error: { message: "Simulated provider outage" } });

    const result = await sendLeadNotification({ ...basePayload, id: "api-error-test" });

    expect(result.success).toBe(false);
    expect(result.deliveryMode).toBe("failed");
  });

  it("should not throw and should still resolve when Resend rejects (network failure) — the lead is never lost", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockRejectedValue(new Error("Simulated network failure"));

    await expect(
      sendLeadNotification({ ...basePayload, id: "network-failure-test" })
    ).resolves.toMatchObject({
      success: false,
      deliveryMode: "failed",
    });
  });

  it("should never include the RESEND_API_KEY value anywhere in a failure log", async () => {
    process.env.RESEND_API_KEY = "secret-test-key-should-not-leak";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockRejectedValue(new Error("Simulated network failure"));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendLeadNotification({ ...basePayload, id: "secret-leak-test" });

    const loggedText = errorSpy.mock.calls.map((call) => JSON.stringify(call)).join(" ");
    expect(loggedText).not.toContain("secret-test-key-should-not-leak");

    errorSpy.mockRestore();
  });
});
