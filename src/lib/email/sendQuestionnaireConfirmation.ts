import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";

export interface QuestionnaireConfirmationPayload {
  customerName: string;
  customerEmail: string;
}

export interface QuestionnaireConfirmationResult {
  success: boolean;
  deliveryMode: "sent" | "dev_logger" | "failed";
}

/**
 * Server-side confirmation email sent to the customer after they submit the
 * intake questionnaire. Tells them they may reply with photos — no file
 * upload infrastructure exists in this app, so this is the v1.0 substitute.
 */
export async function sendQuestionnaireConfirmation(
  payload: QuestionnaireConfirmationPayload
): Promise<QuestionnaireConfirmationResult> {
  const serverEnv = getServerEnv();
  const { RESEND_API_KEY, EMAIL_FROM_ADDRESS } = serverEnv;
  const canSendRealEmail = Boolean(RESEND_API_KEY && EMAIL_FROM_ADDRESS);

  const subject = "Thanks — we received your details (OC Water Features)";

  const emailBodyText = `
Hi ${payload.customerName},

Thank you for completing our questionnaire. We've received your details and will follow up with you shortly.

If photos would help us evaluate the issue, you may reply to this email with the photos attached.

Thank you,
OC Water Features
`.trim();

  if (!canSendRealEmail) {
    console.log("[EMAIL_DEV_LOGGER]", {
      notificationType: "QUESTIONNAIRE_CONFIRMATION",
      destinationEmail: payload.customerEmail,
      timestamp: new Date().toISOString(),
      deliveryMode: "dev_logger_fallback_no_production_config",
    });

    return {
      success: true,
      deliveryMode: "dev_logger",
    };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: EMAIL_FROM_ADDRESS!,
      to: payload.customerEmail,
      subject,
      text: emailBodyText,
    });

    if (error) {
      console.error("[Questionnaire Confirmation Failure] Resend API returned an error:", {
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        deliveryMode: "failed",
      };
    }

    return {
      success: true,
      deliveryMode: "sent",
    };
  } catch (err: unknown) {
    console.error("[Questionnaire Confirmation Failure] Safe error recording:", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      deliveryMode: "failed",
    };
  }
}
