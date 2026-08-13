"use client";

import { trackEvent } from "./gtag";

function currentPagePath(): string {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

/** Fired when a visitor clicks a click-to-call phone link. */
export function trackPhoneCallClick(buttonLocation: string): void {
  trackEvent("phone_call_click", {
    pagePath: currentPagePath(),
    buttonLocation,
  });
}

/** Fired when a visitor clicks a mailto email link. */
export function trackEmailClick(buttonLocation: string): void {
  trackEvent("email_click", {
    pagePath: currentPagePath(),
    buttonLocation,
  });
}

/** Fired once, the first time a visitor interacts with the estimate request form. */
export function trackEstimateFormStart(): void {
  trackEvent("estimate_form_start", {
    pagePath: currentPagePath(),
  });
}

/** Fired after the estimate request form is successfully submitted. */
export function trackEstimateFormSubmit(details: {
  serviceType?: string;
  propertyType?: string;
} = {}): void {
  trackEvent("estimate_form_submit", {
    pagePath: currentPagePath(),
    ...details,
  });
}
