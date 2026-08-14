import { z } from "zod";

// Public Environment Schema (Accessible in Client & Server)
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL").optional(),
  // Current Supabase publishable key (replaces the legacy "anon key" name).
  // Safe to expose client-side by design — it's the public key.
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required").optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL").default("http://localhost:3000"),
  // GA4 Measurement ID (e.g. "G-XXXXXXXXXX"). Optional — when absent, the
  // GoogleAnalytics component renders nothing and analytics helpers no-op.
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).optional(),
  // Google Business Profile review link. Read client-side on the post-review
  // "Leave a Google Review" CTA (src/app/review/[token]/page.tsx), which is
  // why this must be NEXT_PUBLIC_ rather than server-only. Optional and has
  // NO fabricated default — when unset, the CTA simply does not render
  // rather than linking to an invented/placeholder Google URL.
  NEXT_PUBLIC_GOOGLE_REVIEW_URL: z.string().url("NEXT_PUBLIC_GOOGLE_REVIEW_URL must be a valid URL").optional(),
});

// Server-Only Environment Schema (Never accessible in Client Components)
export const serverEnvSchema = z.object({
  // Current Supabase secret key (replaces the legacy "service role key"
  // name). Privileged, server-only — never expose client-side.
  SUPABASE_SECRET_KEY: z.string().min(1, "SUPABASE_SECRET_KEY is required").optional(),
  BUSINESS_NOTIFICATION_EMAIL: z.string().email("BUSINESS_NOTIFICATION_EMAIL must be a valid email").default("ocwaterfeatures@live.com"),
  ADMIN_NOTIFICATION_EMAIL: z.string().email("ADMIN_NOTIFICATION_EMAIL must be a valid email").default("hect24pacheco@gmail.com"),
  ALLOW_DEVELOPMENT_SEED: z.string().optional(),
  // Google Search Console HTML-tag verification value (the content attribute
  // of the <meta name="google-site-verification"> tag Search Console gives
  // you when verifying via the "HTML tag" method). Optional — absent by
  // default so no placeholder/fake verification tag is ever shipped.
  GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
  // Resend API key for transactional email delivery. Optional — when absent
  // (or when EMAIL_FROM_ADDRESS is also absent), sendLeadNotification and
  // sendReviewRequest fall back to a safe development logger instead of
  // attempting a real send. Never exposed client-side.
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY must not be empty").optional(),
  // Verified "from" address/domain for outgoing transactional email (e.g.
  // "OC Water Features <leads@ocwaterfeatures.com>"). Required alongside
  // RESEND_API_KEY before real email delivery is attempted — never invented.
  EMAIL_FROM_ADDRESS: z.string().min(1, "EMAIL_FROM_ADDRESS must not be empty").optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Safely parse and return public environment variables without throwing errors
 * on unconfigured public pages.
 */
export function getPublicEnv(): PublicEnv {
  const parseResult = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GOOGLE_REVIEW_URL: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL,
  });

  if (!parseResult.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Env Warning] Public environment validation issues:", parseResult.error.format());
    }
    return {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      NEXT_PUBLIC_GOOGLE_REVIEW_URL: undefined,
    };
  }

  return parseResult.data;
}

/**
 * Safely parse and return server-only environment variables.
 * Ensures server-only keys are strictly guarded.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: getServerEnv() called on the client side!");
  }

  const parseResult = serverEnvSchema.safeParse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    BUSINESS_NOTIFICATION_EMAIL: process.env.BUSINESS_NOTIFICATION_EMAIL,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    ALLOW_DEVELOPMENT_SEED: process.env.ALLOW_DEVELOPMENT_SEED,
    GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  });

  if (!parseResult.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Env Warning] Server environment validation issues:", parseResult.error.format());
    }
    return {
      BUSINESS_NOTIFICATION_EMAIL: process.env.BUSINESS_NOTIFICATION_EMAIL || "ocwaterfeatures@live.com",
      ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || "hect24pacheco@gmail.com",
      ALLOW_DEVELOPMENT_SEED: process.env.ALLOW_DEVELOPMENT_SEED,
      RESEND_API_KEY: undefined,
      EMAIL_FROM_ADDRESS: undefined,
    };
  }

  return parseResult.data;
}

/**
 * Helper to check if Supabase has valid non-placeholder credentials configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return false;
  if (url.includes("placeholder") || publishableKey.includes("placeholder")) return false;

  return true;
}

/**
 * Helper to check if the Supabase secret key is configured for admin operations.
 */
export function isServerConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey || secretKey.includes("placeholder")) return false;
  return true;
}
