import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { mockGetUser, mockRedirect, mockCreateAdminClient, mockSendReviewRequest } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockRedirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  mockCreateAdminClient: vi.fn(),
  mockSendReviewRequest: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
  })),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: mockCreateAdminClient,
}));

vi.mock("@/lib/email/sendReviewRequest", () => ({
  sendReviewRequest: mockSendReviewRequest,
}));

import { POST } from "../src/app/api/admin/reviews/generate/route";

describe("Admin Reviews Generate — Auth Guard", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockGetUser.mockReset();
    mockCreateAdminClient.mockReset();
    mockSendReviewRequest.mockReset();
  });

  it("rejects an unauthenticated request before any privileged mutation or email send", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new NextRequest("http://localhost/api/admin/reviews/generate", {
      method: "POST",
      body: JSON.stringify({ customerId: "some-customer-id" }),
    });

    await expect(POST(request)).rejects.toThrow(/^REDIRECT:/);

    expect(mockRedirect).toHaveBeenCalledWith("/admin/login");
    expect(mockCreateAdminClient).not.toHaveBeenCalled();
    expect(mockSendReviewRequest).not.toHaveBeenCalled();
  });
});
