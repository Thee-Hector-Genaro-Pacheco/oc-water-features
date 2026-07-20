export interface ReviewRequestPayload {
  customerName: string;
  customerEmail: string;
  serviceType: string;
  rawToken: string;
}

/**
 * Server-side email notification abstraction for sending customer review links.
 * Customer-facing sender must use official business email address.
 */
export async function sendReviewRequest(payload: ReviewRequestPayload): Promise<{ success: boolean; link: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const reviewLink = `${siteUrl}/review/${payload.rawToken}`;

  console.log(`[Email Abstraction] Sending review request to ${payload.customerName} <${payload.customerEmail}>`);
  console.log(`Review Link generated: ${reviewLink}`);

  // TODO: Integrate production email sender (e.g. AWS SES / Resend / Postmark)
  // await resend.emails.send({
  //   from: 'OC Water Features <info@ocwaterfeatures.com>',
  //   to: payload.customerEmail,
  //   subject: `How was your recent ${payload.serviceType} service with OC Water Features?`,
  //   html: `<p>Dear ${payload.customerName}, please leave a review at <a href="${reviewLink}">${reviewLink}</a></p>`
  // });

  return { success: true, link: reviewLink };
}
