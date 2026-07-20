import { getServerEnv } from "@/lib/env";

export interface LeadNotificationPayload {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  property_type: string;
  service_requested: string;
  message: string;
  preferred_contact_method: string;
  created_at: string;
}

/**
 * Server-side email notification abstraction for incoming leads.
 * In development, outputs a non-sensitive metadata log (no messages or secrets).
 */
export async function sendLeadNotification(lead: LeadNotificationPayload): Promise<{ success: boolean }> {
  const env = getServerEnv();
  const destinationEmail = env.BUSINESS_NOTIFICATION_EMAIL || "info@ocwaterfeatures.com";

  // Safe development logger: Logs non-sensitive metadata only
  console.log("[EMAIL_DEV_LOGGER]", {
    notificationType: "LEAD_NOTIFICATION",
    destinationEmail,
    leadId: lead.id,
    timestamp: new Date().toISOString(),
    status: "DELIVERY_PENDING_PRODUCTION_PROVIDER_SELECTION",
  });

  return { success: true };
}
