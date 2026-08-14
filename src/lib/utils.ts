import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { companyData } from "@/data/company";
import { getSiteUrl } from "@/lib/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds the sitewide LocalBusiness JSON-LD structured data.
 *
 * PHASE 0 SAFETY RULES — do not add fields back in without verified backing data:
 * - No street address or geo coordinates: the only addresses on file for this
 *   business are residential/private and must never be published. This is
 *   modeled as a service-area business (no `address`/`hasMap`), relying on
 *   `areaServed` instead, per Schema.org/Google guidance for SABs.
 * - No `openingHoursSpecification`: business hours have not been independently
 *   verified for this schema (see docs/client-notes.md).
 * - No `aggregateRating`/`review`: not yet backed by a live review data source.
 * - No `sameAs`: no verified Google Business Profile / social profile URLs yet.
 * - No `priceRange`: not verified.
 * - telephone/email/description are sourced from src/data/company.ts, the
 *   single source of truth for business information.
 */
export function generateLocalBusinessSchema() {
  const siteUrl = getSiteUrl();
  const telephone = companyData.phoneRaw.replace(/^tel:/, "");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyData.name,
    "image": `${siteUrl}/logos/OCWaterFeatLogo.png`,
    "@id": `${siteUrl}/#organization`,
    "url": siteUrl,
    "telephone": telephone,
    "email": companyData.emailDisplay,
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Orange County, CA"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Los Angeles County, CA"
      }
    ],
    "description": companyData.shortDescription
  };
}
