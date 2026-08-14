import { Resend } from "resend";
import { getServerEnv, getSiteUrl } from "@/lib/env";

export interface ReviewRequestNotificationPayload {
  customerName: string;
  customerEmail: string;
  serviceType: string;
  rawToken: string;
}

export interface ReviewRequestNotificationResult {
  success: boolean;
  link: string;
}

/**
 * Server-side email notification for customer review requests.
 *
 * Sends the customer their secure, single-use review link via Resend when
 * RESEND_API_KEY and EMAIL_FROM_ADDRESS are both configured; otherwise
 * safely logs to the console instead of sending real email.
 *
 * SECURITY: the raw review token is embedded in the link sent to the
 * customer (required so they can access their review page), but it is
 * never written to server logs or included in error output — only
 * non-sensitive metadata (recipient, timestamp, status) is logged.
 */
export async function sendReviewRequest(
  payload: ReviewRequestNotificationPayload
): Promise<ReviewRequestNotificationResult> {
  const serverEnv = getServerEnv();

  const siteUrl = getSiteUrl();
  const reviewLink = `${siteUrl}/review/${payload.rawToken}`;

  const { RESEND_API_KEY, EMAIL_FROM_ADDRESS } = serverEnv;
  const canSendRealEmail = Boolean(RESEND_API_KEY && EMAIL_FROM_ADDRESS);

  const subject = "How did we do? Share your feedback — OC Water Features";

  const emailBodyText = `
Hi ${payload.customerName},

Thank you for choosing OC Water Features for your recent ${payload.serviceType.toLowerCase()} service. We'd love to hear about your experience.

Please share your feedback using your secure, one-time link below:
${reviewLink}

This link is unique to you and will expire after use.

Thank you,
OC Water Features
`.trim();

  // Safe development logger: never includes the raw token or reviewLink,
  // only non-sensitive metadata.
  if (!canSendRealEmail) {
    console.log("[EMAIL_DEV_LOGGER]", {
      notificationType: "REVIEW_REQUEST_NOTIFICATION",
      destinationEmail: payload.customerEmail,
      timestamp: new Date().toISOString(),
      status: "dev_logger_fallback_no_production_config",
    });

    return {
      success: true,
      link: reviewLink,
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
      // Log only the provider's error message — never the token/link/body.
      console.error("[Review Request Notification Failure] Resend API returned an error:", {
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        link: reviewLink,
      };
    }

    return {
      success: true,
      link: reviewLink,
    };
  } catch (err: unknown) {
    console.error("[Review Request Notification Failure] Safe error recording:", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      link: reviewLink,
    };
  }
}
