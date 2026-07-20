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
 * Server-side email notification abstraction for new lead submissions.
 * Target recipient: BUSINESS_NOTIFICATION_EMAIL (and optional ADMIN_NOTIFICATION_EMAIL copy).
 */
export async function sendLeadNotification(lead: LeadNotificationPayload): Promise<{ success: boolean; messageId?: string }> {
  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL || "info@ocwaterfeatures.com";
  const adminCopyEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@ocwaterfeatures.com";

  console.log(`[Email Abstraction] Sending new lead notification for Lead #${lead.id} to ${businessEmail} and CC ${adminCopyEmail}`);
  console.log(`Lead Details: ${lead.full_name} (${lead.phone}, ${lead.email}) from ${lead.city} requesting ${lead.service_requested}`);

  // TODO: Integrate with production email provider (Resend, AWS SES, or SendGrid)
  // Example implementation with Resend:
  // await resend.emails.send({
  //   from: 'OC Water Features Leads <notifications@ocwaterfeatures.com>',
  //   to: businessEmail,
  //   cc: adminCopyEmail,
  //   subject: `New Lead: ${lead.service_requested} in ${lead.city} - ${lead.full_name}`,
  //   html: `<p>New estimate request from ${lead.full_name}...</p>`
  // });

  return { success: true, messageId: `mock-lead-msg-${Date.now()}` };
}
