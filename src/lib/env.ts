import { z } from "zod";

// Public Environment Schema (Accessible in Client & Server)
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL").optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required").optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL").default("http://localhost:3000"),
  // GA4 Measurement ID (e.g. "G-XXXXXXXXXX"). Optional — when absent, the
  // GoogleAnalytics component renders nothing and analytics helpers no-op.
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).optional(),
});

// Server-Only Environment Schema (Never accessible in Client Components)
export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required").optional(),
  BUSINESS_NOTIFICATION_EMAIL: z.string().email("BUSINESS_NOTIFICATION_EMAIL must be a valid email").default("ocwaterfeatures@live.com"),
  ADMIN_NOTIFICATION_EMAIL: z.string().email("ADMIN_NOTIFICATION_EMAIL must be a valid email").default("hect24pacheco@gmail.com"),
  GOOGLE_REVIEW_URL: z.string().url("GOOGLE_REVIEW_URL must be a valid URL").default("https://g.page/r/placeholder/review"),
  ALLOW_DEVELOPMENT_SEED: z.string().optional(),
  // Google Search Console HTML-tag verification value (the content attribute
  // of the <meta name="google-site-verification"> tag Search Console gives
  // you when verifying via the "HTML tag" method). Optional — absent by
  // default so no placeholder/fake verification tag is ever shipped.
  GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),
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
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parseResult.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Env Warning] Public environment validation issues:", parseResult.error.format());
    }
    return {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
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
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BUSINESS_NOTIFICATION_EMAIL: process.env.BUSINESS_NOTIFICATION_EMAIL,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    GOOGLE_REVIEW_URL: process.env.GOOGLE_REVIEW_URL,
    ALLOW_DEVELOPMENT_SEED: process.env.ALLOW_DEVELOPMENT_SEED,
  });

  if (!parseResult.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Env Warning] Server environment validation issues:", parseResult.error.format());
    }
    return {
      BUSINESS_NOTIFICATION_EMAIL: process.env.BUSINESS_NOTIFICATION_EMAIL || "ocwaterfeatures@live.com",
      ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || "hect24pacheco@gmail.com",
      GOOGLE_REVIEW_URL: process.env.GOOGLE_REVIEW_URL || "https://g.page/r/placeholder/review",
      ALLOW_DEVELOPMENT_SEED: process.env.ALLOW_DEVELOPMENT_SEED,
    };
  }

  return parseResult.data;
}

/**
 * Helper to check if Supabase has valid non-placeholder credentials configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes("placeholder") || anonKey.includes("placeholder")) return false;

  return true;
}

/**
 * Helper to check if Supabase Service Role Key is configured for admin operations.
 */
export function isServerConfigured(): boolean {
  if (!isSupabaseConfigured()) return false;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || serviceKey.includes("placeholder")) return false;
  return true;
}
