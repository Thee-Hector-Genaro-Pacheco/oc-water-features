import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getPublicEnv,
  getServerEnv,
  publicEnvSchema,
  serverEnvSchema,
  isSupabaseConfigured,
  isServerConfigured,
} from "../src/lib/env";

describe("Public Environment Schema — Google Review URL", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("should leave NEXT_PUBLIC_GOOGLE_REVIEW_URL unset without inventing a placeholder value", () => {
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_GOOGLE_REVIEW_URL).toBeUndefined();
  });

  it("should pass through a real NEXT_PUBLIC_GOOGLE_REVIEW_URL when configured", () => {
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL = "https://g.page/r/real-place-id/review";
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_GOOGLE_REVIEW_URL).toBe("https://g.page/r/real-place-id/review");
  });

  it("should reject an invalid NEXT_PUBLIC_GOOGLE_REVIEW_URL rather than silently accepting garbage", () => {
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL = "not-a-url";
    const env = getPublicEnv();
    // Falls through to the safe-fallback branch, which never fabricates a URL.
    expect(env.NEXT_PUBLIC_GOOGLE_REVIEW_URL).toBeUndefined();
  });
});

describe("Public Environment Schema — secret isolation", () => {
  it("should never define RESEND_API_KEY or EMAIL_FROM_ADDRESS in the client-exposed schema", () => {
    const keys = Object.keys(publicEnvSchema.shape);
    expect(keys).not.toContain("RESEND_API_KEY");
    expect(keys).not.toContain("EMAIL_FROM_ADDRESS");
  });

  it("should not leak a RESEND_API_KEY value through getPublicEnv() even if present in process.env", () => {
    const ORIGINAL = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "secret-should-not-appear-client-side";

    const env = getPublicEnv() as Record<string, unknown>;
    expect(env.RESEND_API_KEY).toBeUndefined();

    if (ORIGINAL === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = ORIGINAL;
    }
  });
});

describe("Supabase key migration — publishable/secret naming", () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("should expose NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY through the public env helper", () => {
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test-value-not-real";
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe("sb_publishable_test-value-not-real");
  });

  it("should never define SUPABASE_SECRET_KEY in the client-exposed schema", () => {
    const keys = Object.keys(publicEnvSchema.shape);
    expect(keys).not.toContain("SUPABASE_SECRET_KEY");
  });

  it("should not leak a SUPABASE_SECRET_KEY value through getPublicEnv() even if present in process.env", () => {
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test-value-should-not-leak";
    const env = getPublicEnv() as Record<string, unknown>;
    expect(env.SUPABASE_SECRET_KEY).toBeUndefined();
  });

  it("should only allow SUPABASE_SECRET_KEY through the server-only env accessor, and define it there", () => {
    const keys = Object.keys(serverEnvSchema.shape);
    expect(keys).toContain("SUPABASE_SECRET_KEY");

    process.env.SUPABASE_SECRET_KEY = "sb_secret_test-value-not-real";
    const serverEnv = getServerEnv();
    expect(serverEnv.SUPABASE_SECRET_KEY).toBe("sb_secret_test-value-not-real");
  });

  it("should throw if getServerEnv() is ever called from a client context", () => {
    // @ts-expect-error simulating a browser global for this test only
    globalThis.window = {};
    expect(() => getServerEnv()).toThrow(/CRITICAL SECURITY ERROR/);
    // @ts-expect-error cleaning up the simulated browser global
    delete globalThis.window;
  });

  it("isSupabaseConfigured() should detect a real publishable key + URL as configured", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://real-project-ref.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test-value-not-real";
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("isSupabaseConfigured() should treat placeholder values as unconfigured", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://placeholder-project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "placeholder-publishable-key";
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("isSupabaseConfigured() should treat missing values as unconfigured", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("isServerConfigured() should require both Supabase configuration and a real secret key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://real-project-ref.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test-value-not-real";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test-value-not-real";
    expect(isServerConfigured()).toBe(true);
  });

  it("isServerConfigured() should stay false when only the publishable key is real but the secret key is a placeholder", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://real-project-ref.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test-value-not-real";
    process.env.SUPABASE_SECRET_KEY = "placeholder-secret-key";
    expect(isServerConfigured()).toBe(false);
  });

  it("isServerConfigured() should stay false when the secret key is missing entirely", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://real-project-ref.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test-value-not-real";
    delete process.env.SUPABASE_SECRET_KEY;
    expect(isServerConfigured()).toBe(false);
  });
});
