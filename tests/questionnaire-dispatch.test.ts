import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSendInvite, mockGenerateToken } = vi.hoisted(() => ({
  mockSendInvite: vi.fn(),
  mockGenerateToken: vi.fn(() => ({ rawToken: "raw-token-value", tokenHash: "hashed-token-value" })),
}));

vi.mock("@/lib/email/sendQuestionnaireInvite", () => ({
  sendQuestionnaireInvite: mockSendInvite,
}));

vi.mock("@/lib/questionnaire/tokens", () => ({
  generateQuestionnaireToken: mockGenerateToken,
}));

import { createOrResendQuestionnaire } from "../src/lib/questionnaire/dispatch";

// Minimal chainable Supabase query-builder stub. Each `.from(...)` call pops
// the next queued { data, error } result off the front of the queue —
// mirrors the exact sequential await calls createOrResendQuestionnaire makes.
function makeMockSupabase(responseQueue: Array<{ data: unknown; error: unknown }>) {
  const queue = [...responseQueue];

  const from = vi.fn(() => {
    const result = queue.shift() ?? { data: null, error: null };
    const chain: Record<string, unknown> = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      maybeSingle: vi.fn(() => Promise.resolve(result)),
      single: vi.fn(() => Promise.resolve(result)),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      then: (resolve: (v: typeof result) => void) => resolve(result),
    };
    return chain;
  });

  return { from } as never;
}

describe("createOrResendQuestionnaire", () => {
  beforeEach(() => {
    mockSendInvite.mockReset();
    mockGenerateToken.mockClear();
  });

  const baseParams = { leadId: "lead-1", leadName: "Jane Doe", leadEmail: "jane@example.com" };

  it("inserts a new row and marks it 'sent' only when the invite email actually sends", async () => {
    mockSendInvite.mockResolvedValue({ success: true, deliveryMode: "sent", link: "https://example.com/questionnaire/raw-token-value" });

    const supabase = makeMockSupabase([
      { data: null, error: null }, // select existing -> none
      { data: { id: "q1" }, error: null }, // insert -> new row
      { data: null, error: null }, // final update to status: sent
    ]);

    const result = await createOrResendQuestionnaire(supabase, baseParams);

    expect(result.outcome).toBe("sent");
    expect(result.deliveryMode).toBe("sent");
    expect(result.questionnaireId).toBe("q1");
  });

  it("does not claim 'sent' when the invite email only reaches dev-logger fallback", async () => {
    mockSendInvite.mockResolvedValue({ success: true, deliveryMode: "dev_logger", link: "https://example.com/questionnaire/raw-token-value" });

    const supabase = makeMockSupabase([
      { data: null, error: null }, // select existing -> none
      { data: { id: "q2" }, error: null }, // insert -> new row
      // No third response queued/consumed: dispatch must NOT call the
      // "mark as sent" update when deliveryMode !== "sent".
    ]);

    const result = await createOrResendQuestionnaire(supabase, baseParams);

    expect(result.outcome).toBe("queued");
    expect(result.deliveryMode).toBe("dev_logger");
  });

  it("does not claim 'sent' when the invite email fails to send", async () => {
    mockSendInvite.mockResolvedValue({ success: false, deliveryMode: "failed", link: "https://example.com/questionnaire/raw-token-value" });

    const supabase = makeMockSupabase([
      { data: null, error: null },
      { data: { id: "q3" }, error: null },
    ]);

    const result = await createOrResendQuestionnaire(supabase, baseParams);

    expect(result.outcome).toBe("queued");
    expect(result.deliveryMode).toBe("failed");
  });

  it("rotates the token on an existing, not-yet-submitted questionnaire instead of inserting a duplicate row", async () => {
    mockSendInvite.mockResolvedValue({ success: true, deliveryMode: "sent", link: "https://example.com/questionnaire/raw-token-value" });

    const supabase = makeMockSupabase([
      { data: { id: "q-existing", status: "sent" }, error: null }, // select existing -> found, not submitted
      { data: { id: "q-existing" }, error: null }, // update (rotate token)
      { data: null, error: null }, // final update to status: sent
    ]);

    const result = await createOrResendQuestionnaire(supabase, baseParams);

    expect(result.outcome).toBe("sent");
    expect(result.questionnaireId).toBe("q-existing");
    // A fresh token must have been generated for the resend (rotation).
    expect(mockGenerateToken).toHaveBeenCalledTimes(1);
  });

  it("refuses to resend (and never overwrites answers) once a questionnaire has already been submitted", async () => {
    const supabase = makeMockSupabase([
      { data: { id: "q-done", status: "submitted" }, error: null },
    ]);

    const result = await createOrResendQuestionnaire(supabase, baseParams);

    expect(result.outcome).toBe("already_submitted");
    expect(mockSendInvite).not.toHaveBeenCalled();
  });
});
