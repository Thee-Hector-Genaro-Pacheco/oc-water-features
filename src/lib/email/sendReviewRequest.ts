import { getPublicEnv } from "@/lib/env";

export interface ReviewRequestNotificationPayload {
  customerName: string;
  customerEmail: string;
  serviceType: string;
  rawToken: string;
}

/**
 * Server-side email notification abstraction for customer review requests.
 * In development, outputs a non-sensitive metadata log (no raw tokens or secrets).
 */
export async function sendReviewRequest(
  payload: ReviewRequestNotificationPayload
): Promise<{ success: boolean; link: string }> {
  const publicEnv = getPublicEnv();
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const reviewLink = `${siteUrl}/review/${payload.rawToken}`;

  // Safe development logger: Logs non-sensitive metadata only (token is obscured)
  console.log("[EMAIL_DEV_LOGGER]", {
    notificationType: "REVIEW_REQUEST_NOTIFICATION",
    destinationEmail: payload.customerEmail,
    timestamp: new Date().toISOString(),
    status: "DELIVERY_PENDING_PRODUCTION_PROVIDER_SELECTION",
  });

  return {
    success: true,
    link: reviewLink,
  };
}
