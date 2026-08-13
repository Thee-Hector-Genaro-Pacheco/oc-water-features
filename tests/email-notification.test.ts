import { describe, it, expect } from "vitest";
import { sendLeadNotification } from "../src/lib/email/sendLeadNotification";

describe("Lead Email Notification Dispatcher", () => {
  it("should send lead notifications to both business owner and technical administrator", async () => {
    const payload = {
      id: "test-lead-123",
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

    const result = await sendLeadNotification(payload);

    expect(result.success).toBe(true);
    expect(result.recipients).toContain("ocwaterfeatures@live.com");
    expect(result.recipients).toContain("hect24pacheco@gmail.com");
    expect(result.subject).toContain("Fountain Repair");
    expect(result.subject).toContain("Huntington Beach");
    expect(result.adminLink).toContain("/admin/leads/test-lead-123");
  });

  it("should prevent duplicate emails from accidental repeated processing", async () => {
    const payload = {
      id: "duplicate-lead-456",
      full_name: "Duplicate Test Customer",
      phone: "(714) 362-4376",
      email: "duplicate@example.com",
      city: "Irvine",
      property_type: "Commercial",
      service_requested: "Pond Cleaning",
      message: "Duplicate test",
      preferred_contact_method: "Email",
      created_at: new Date().toISOString(),
    };

    const firstRun = await sendLeadNotification(payload);
    expect(firstRun.success).toBe(true);

    const secondRun = await sendLeadNotification(payload);
    expect(secondRun.success).toBe(true);
    expect(secondRun.deliveryMode).toBe("dev_logger");
  });
});
