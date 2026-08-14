import { Resend } from "resend";
import { getServerEnv, getSiteUrl } from "@/lib/env";

export interface QuestionnaireCompletionPayload {
  leadId: string;
  leadName: string;
  serviceRequested: string[];
  propertyType: string;
  submittedAt: string;
}

export interface QuestionnaireCompletionResult {
  success: boolean;
  recipients: string[];
  deliveryMode: "sent" | "dev_logger" | "failed";
  adminLink: string;
}

/**
 * Server-side email notification to the business when a customer completes
 * the intake questionnaire. Mirrors sendLeadNotification.ts's dual-recipient,
 * dev-logger-fallback pattern.
 */
export async function sendQuestionnaireCompletionNotification(
  payload: QuestionnaireCompletionPayload
): Promise<QuestionnaireCompletionResult> {
  const serverEnv = getServerEnv();

  const businessEmail = serverEnv.BUSINESS_NOTIFICATION_EMAIL || "ocwaterfeatures@live.com";
  const adminEmail = serverEnv.ADMIN_NOTIFICATION_EMAIL || "hect24pacheco@gmail.com";
  const recipients = Array.from(new Set([businessEmail, adminEmail].filter(Boolean)));

  const siteUrl = getSiteUrl();
  const adminLink = `${siteUrl}/admin/leads/${payload.leadId}`;

  const subject = `Questionnaire Completed — ${payload.leadName} — ${payload.serviceRequested.join(", ")}`;

  const emailBodyText = `
QUESTIONNAIRE COMPLETED — OC WATER FEATURES

Lead Name: ${payload.leadName}
Requested Service(s): ${payload.serviceRequested.join(", ")}
Property Type: ${payload.propertyType}
Submitted: ${payload.submittedAt}

View full responses in the Admin Portal:
${adminLink}
`.trim();

  const { RESEND_API_KEY, EMAIL_FROM_ADDRESS } = serverEnv;
  const canSendRealEmail = Boolean(RESEND_API_KEY && EMAIL_FROM_ADDRESS);

  if (!canSendRealEmail) {
    console.log("[EMAIL_DEV_LOGGER] Questionnaire Completion Dispatched:", {
      notificationType: "QUESTIONNAIRE_COMPLETION",
      recipientsCount: recipients.length,
      leadId: payload.leadId,
      subject,
      adminLink,
      timestamp: new Date().toISOString(),
      deliveryMode: "dev_logger_fallback_no_production_config",
    });

    return {
      success: true,
      recipients,
      deliveryMode: "dev_logger",
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
      console.error("[Questionnaire Completion Notification Failure] Resend API returned an error:", {
        leadId: payload.leadId,
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        recipients,
        deliveryMode: "failed",
        adminLink,
      };
    }

    return {
      success: true,
      recipients,
      deliveryMode: "sent",
      adminLink,
    };
  } catch (err: unknown) {
    console.error("[Questionnaire Completion Notification Failure] Safe error recording:", {
      leadId: payload.leadId,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      recipients,
      deliveryMode: "failed",
      adminLink,
    };
  }
}
