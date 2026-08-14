import { Resend } from "resend";
import { getServerEnv, getSiteUrl } from "@/lib/env";

export interface QuestionnaireInvitePayload {
  leadId: string;
  leadName: string;
  leadEmail: string;
  rawToken: string;
}

export interface QuestionnaireInviteResult {
  success: boolean;
  deliveryMode: "sent" | "dev_logger" | "failed";
  link: string;
}

/**
 * Server-side email notification inviting a new lead to complete the
 * customer intake questionnaire (second-stage qualification after the
 * public lead form).
 *
 * Sends via Resend when RESEND_API_KEY and EMAIL_FROM_ADDRESS are both
 * configured; otherwise safely logs to the console instead of sending real
 * email. The caller is responsible for only marking the questionnaire
 * record "sent" when deliveryMode === "sent" — "dev_logger" means no real
 * email reached the customer.
 */
export async function sendQuestionnaireInvite(
  payload: QuestionnaireInvitePayload
): Promise<QuestionnaireInviteResult> {
  const serverEnv = getServerEnv();

  const siteUrl = getSiteUrl();
  const questionnaireLink = `${siteUrl}/questionnaire/${payload.rawToken}`;

  const { RESEND_API_KEY, EMAIL_FROM_ADDRESS } = serverEnv;
  const canSendRealEmail = Boolean(RESEND_API_KEY && EMAIL_FROM_ADDRESS);

  const subject = "Help us prepare for your service — a few quick questions (OC Water Features)";

  const emailBodyText = `
Hi ${payload.leadName},

Thank you for reaching out to OC Water Features. To help us prepare accurate recommendations before we contact you, please take a minute to answer a few quick questions about your water feature:

${questionnaireLink}

This link is unique to you.

Thank you,
OC Water Features
`.trim();

  // Safe development logger: never includes the raw token or link, only
  // non-sensitive metadata.
  if (!canSendRealEmail) {
    console.log("[EMAIL_DEV_LOGGER]", {
      notificationType: "QUESTIONNAIRE_INVITE",
      leadId: payload.leadId,
      destinationEmail: payload.leadEmail,
      timestamp: new Date().toISOString(),
      deliveryMode: "dev_logger_fallback_no_production_config",
    });

    return {
      success: true,
      deliveryMode: "dev_logger",
      link: questionnaireLink,
    };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: EMAIL_FROM_ADDRESS!,
      to: payload.leadEmail,
      subject,
      text: emailBodyText,
    });

    if (error) {
      console.error("[Questionnaire Invite Failure] Resend API returned an error:", {
        leadId: payload.leadId,
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        deliveryMode: "failed",
        link: questionnaireLink,
      };
    }

    return {
      success: true,
      deliveryMode: "sent",
      link: questionnaireLink,
    };
  } catch (err: unknown) {
    console.error("[Questionnaire Invite Failure] Safe error recording:", {
      leadId: payload.leadId,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      deliveryMode: "failed",
      link: questionnaireLink,
    };
  }
}
