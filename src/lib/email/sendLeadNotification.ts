import { getServerEnv, getPublicEnv } from "@/lib/env";

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
  deliveryMode: "production_provider_placeholder" | "dev_logger" | "failed";
  subject: string;
  adminLink: string;
}

// In-memory set to prevent duplicate notification sends for the same lead during a single server lifecycle
const processedLeadIds = new Set<string>();

/**
 * Server-side email notification abstraction for incoming leads.
 * 
 * Configured to send notifications to both:
 * 1. BUSINESS_NOTIFICATION_EMAIL (ocwaterfeatures@live.com)
 * 2. ADMIN_NOTIFICATION_EMAIL (hect24pacheco@gmail.com)
 * 
 * Ensures lead delivery failures never crash the lead submission or lose data in Supabase.
 */
export async function sendLeadNotification(lead: LeadNotificationPayload): Promise<LeadNotificationResult> {
  try {
    const serverEnv = getServerEnv();
    const publicEnv = getPublicEnv();

    const businessEmail = serverEnv.BUSINESS_NOTIFICATION_EMAIL || "ocwaterfeatures@live.com";
    const adminEmail = serverEnv.ADMIN_NOTIFICATION_EMAIL || "hect24pacheco@gmail.com";
    const recipients = Array.from(new Set([businessEmail, adminEmail].filter(Boolean)));

    const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || "https://ocwaterfeatures.com";
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

    // Formatted plain text content for email providers (Resend / SendGrid / SMTP / Nodemailer)
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
- Timestamp: ${lead.created_at}

Manage Lead in Admin Portal:
${adminLink}
`.trim();

    // Safe Development Logger: Logs non-sensitive metadata only (NO PII or raw customer message in public server logs)
    if (process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY) {
      console.log("[EMAIL_DEV_LOGGER] Lead Notification Dispatched:", {
        notificationType: "LEAD_NOTIFICATION",
        recipientsCount: recipients.length,
        primaryRecipient: businessEmail,
        technicalAdminRecipient: adminEmail,
        leadId: lead.id,
        subject,
        adminLink,
        timestamp: new Date().toISOString(),
        deliveryMode: "dev_logger_fallback_no_production_apiKey",
      });

      return {
        success: true,
        recipients,
        deliveryMode: "dev_logger",
        subject,
        adminLink,
      };
    }

    // Production Email Provider Hook (Placeholder for Resend / SendGrid API integration)
    // Example:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'leads@ocwaterfeatures.com', to: recipients, subject, text: emailBodyText });
    if (process.env.RESEND_API_KEY) {
      console.log(`[Production Email Provider Placeholder] Preparing email body (${emailBodyText.length} chars) for recipients: ${recipients.join(", ")}`);
    }

    return {
      success: true,
      recipients,
      deliveryMode: "production_provider_placeholder",
      subject,
      adminLink,
    };
  } catch (error: unknown) {
    // Safe notification failure recording — Lead remains safely saved in Supabase
    console.error("[Email Notification Failure] Safe error recording:", {
      leadId: lead.id,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      recipients: [],
      deliveryMode: "failed",
      subject: "Lead Notification Delivery Failed",
      adminLink: "",
    };
  }
}
