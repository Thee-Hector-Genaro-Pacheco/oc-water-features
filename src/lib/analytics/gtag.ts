"use client";

/**
 * Core GA4 (gtag.js) integration.
 *
 * Production-safe by design: everything in this file gates on
 * NEXT_PUBLIC_GA_MEASUREMENT_ID being set. When it's absent (e.g. local
 * development, or before Hector creates a GA4 property), every function here
 * quietly no-ops instead of throwing or attempting to load a script — the
 * site must never break because analytics isn't configured.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function isAnalyticsConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a single analytics event.
 *
 * - Always pushes a plain `{ event: eventName, ...params }` object onto
 *   `window.dataLayer`, so a GTM container (or anything else reading the
 *   dataLayer) can pick it up regardless of whether gtag.js is loaded.
 * - Additionally calls `window.gtag('event', ...)` when gtag.js has loaded
 *   (see <GoogleAnalytics /> in src/components/analytics), which is what
 *   actually sends the event to GA4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * - No-ops on the server and swallows any runtime errors — analytics must
 *   never break page rendering or user interactions.
 */
export function trackEvent(eventName: string, params: GtagEventParams = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`[Analytics Event] ${eventName}:`, params);
    }
  } catch {
    // Analytics must never break the page.
  }
}
