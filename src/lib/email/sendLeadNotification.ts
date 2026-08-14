import { Resend } from "resend";
import { getServerEnv, getSiteUrl } from "@/lib/env";

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
  referrer?: string | null;
  landing_page?: string | null;
  utm_campaign?: string | null;
  created_at: string;
}

export interface LeadNotificationResult {
  success: boolean;
  recipients: string[];
  deliveryMode: "sent" | "dev_logger" | "failed";
  subject: string;
  adminLink: string;
}

// In-memory set to prevent duplicate notification sends for the same lead during a single server lifecycle
const processedLeadIds = new Set<string>();

/**
 * Server-side email notification for incoming leads.
 *
 * Sends to both BUSINESS_NOTIFICATION_EMAIL and ADMIN_NOTIFICATION_EMAIL via
 * Resend when RESEND_API_KEY and EMAIL_FROM_ADDRESS are both configured;
 * otherwise safely logs to the console instead of sending real email (see
 * docs/email-notification-plan.md). Never throws — a lead that already made
 * it into Supabase must never be lost because notification delivery fails.
 */
export async function sendLeadNotification(lead: LeadNotificationPayload): Promise<LeadNotificationResult> {
  const serverEnv = getServerEnv();

  const businessEmail = serverEnv.BUSINESS_NOTIFICATION_EMAIL || "ocwaterfeatures@live.com";
  const adminEmail = serverEnv.ADMIN_NOTIFICATION_EMAIL || "hect24pacheco@gmail.com";
  const recipients = Array.from(new Set([businessEmail, adminEmail].filter(Boolean)));

  const siteUrl = getSiteUrl();
  const adminLink = `${siteUrl}/admin/leads/${lead.id}`;

  const subject = `New Website Lead — ${lead.service_requested || "General Request"} — ${lead.city || "Orange County"}`;

  // Duplicate prevention check
  if (lead.id && processedLeadIds.has(lead.id) && lead.id !== "demo-lead-id") {
    console.log(`[Email Notification] Duplicate notification attempt prevented for lead ID: ${lead.id}`);
    return {
      success: true,
      recipients,
      deliveryMode: "dev_logger",
      subject,
      adminLink,
    };
  }

  if (lead.id && lead.id !== "demo-lead-id") {
    processedLeadIds.add(lead.id);
  }

  const emailBodyText = `
NEW ESTIMATE REQUEST — OC WATER FEATURES

Customer Name: ${lead.full_name}
Phone: ${lead.phone}
Email: ${lead.email}
City: ${lead.city}
Property Type: ${lead.property_type}
Requested Service: ${lead.service_requested}
Preferred Contact Method: ${lead.preferred_contact_method}

Customer Description:
${lead.message}

Marketing & Attribution:
- Lead Source: ${lead.referrer || lead.landing_page || "Direct Website Visit"}
- UTM Campaign: ${lead.utm_campaign || "None"}
- Lead ID: ${lead.id}
- Submitted: ${lead.created_at}

Manage Lead in Admin Portal:
${adminLink}
`.trim();

  const { RESEND_API_KEY, EMAIL_FROM_ADDRESS } = serverEnv;
  const canSendRealEmail = Boolean(RESEND_API_KEY && EMAIL_FROM_ADDRESS);

  // Safe development logger: used whenever Resend isn't fully configured, so
  // no real email can be sent accidentally. Logs non-sensitive metadata only
  // (no raw customer message, no secrets) to keep server logs clean.
  if (!canSendRealEmail) {
    console.log("[EMAIL_DEV_LOGGER] Lead Notification Dispatched:", {
      notificationType: "LEAD_NOTIFICATION",
      recipientsCount: recipients.length,
      primaryRecipient: businessEmail,
      technicalAdminRecipient: adminEmail,
      leadId: lead.id,
      subject,
      adminLink,
      timestamp: new Date().toISOString(),
      deliveryMode: "dev_logger_fallback_no_production_config",
    });

    return {
      success: true,
      recipients,
      deliveryMode: "dev_logger",
      subject,
      adminLink,
    };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: EMAIL_FROM_ADDRESS!,
      to: recipients,
      subject,
      text: emailBodyText,
    });

    if (error) {
      // Provider error is logged server-side only (message text, never the
      // API key or other secrets) — the lead itself is already safely
      // persisted in Supabase by the time this function is called.
      console.error("[Email Notification Failure] Resend API returned an error:", {
        leadId: lead.id,
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        recipients,
        deliveryMode: "failed",
        subject,
        adminLink,
      };
    }

    return {
      success: true,
      recipients,
      deliveryMode: "sent",
      subject,
      adminLink,
    };
  } catch (err: unknown) {
    // Network/SDK-level failure — same safe handling as an API-level error.
    console.error("[Email Notification Failure] Safe error recording:", {
      leadId: lead.id,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      recipients,
      deliveryMode: "failed",
      subject,
      adminLink,
    };
  }
}
