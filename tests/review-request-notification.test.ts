import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockSend = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(function MockResend() {
      return { emails: { send: mockSend } };
    }),
  };
});

import { sendReviewRequest } from "../src/lib/email/sendReviewRequest";

const RAW_TOKEN = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678";

const basePayload = {
  customerName: "Jane Doe",
  customerEmail: "jane@example.com",
  serviceType: "Fountain Repair",
  rawToken: RAW_TOKEN,
};

describe("Review Request Email Notification", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    mockSend.mockReset();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM_ADDRESS;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("should generate a review link containing the raw token and use dev-logger mode when Resend is unconfigured", async () => {
    const result = await sendReviewRequest(basePayload);

    expect(result.success).toBe(true);
    expect(result.link).toContain(RAW_TOKEN);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("should send the review request via Resend to the customer's email when configured (mocked)", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockResolvedValue({ data: { id: "email-id-456" }, error: null });

    const result = await sendReviewRequest(basePayload);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const callArgs = mockSend.mock.calls[0][0];
    expect(callArgs.to).toBe("jane@example.com");
    expect(callArgs.from).toBe("OC Water Features <leads@ocwaterfeatures.com>");
    expect(callArgs.text).toContain(RAW_TOKEN);

    expect(result.success).toBe(true);
    expect(result.link).toContain(RAW_TOKEN);
  });

  it("should handle a failed Resend delivery without throwing", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockResolvedValue({ data: null, error: { message: "Simulated provider outage" } });

    const result = await sendReviewRequest(basePayload);

    expect(result.success).toBe(false);
    // The link itself is still returned to the caller (e.g. for admin retry/visibility) — only server logs must stay silent, see the leakage test below.
    expect(result.link).toContain(RAW_TOKEN);
  });

  it("should not throw when Resend rejects with a network error", async () => {
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockRejectedValue(new Error("Simulated network failure"));

    await expect(sendReviewRequest(basePayload)).resolves.toMatchObject({
      success: false,
    });
  });

  it("should never log the raw token to the console, across dev-logger, success, API-error, and network-failure paths", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Dev-logger path (no Resend config)
    await sendReviewRequest(basePayload);

    // Resend success path
    process.env.RESEND_API_KEY = "test-key-not-real";
    process.env.EMAIL_FROM_ADDRESS = "OC Water Features <leads@ocwaterfeatures.com>";
    mockSend.mockResolvedValue({ data: { id: "email-id-789" }, error: null });
    await sendReviewRequest(basePayload);

    // Resend API-error path
    mockSend.mockResolvedValue({ data: null, error: { message: "Simulated outage" } });
    await sendReviewRequest(basePayload);

    // Resend thrown-exception path
    mockSend.mockRejectedValue(new Error("Simulated network failure"));
    await sendReviewRequest(basePayload);

    const allLoggedText = [...logSpy.mock.calls, ...errorSpy.mock.calls]
      .map((call) => JSON.stringify(call))
      .join(" ");

    expect(allLoggedText).not.toContain(RAW_TOKEN);

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
