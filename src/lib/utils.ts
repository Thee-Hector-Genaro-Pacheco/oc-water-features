import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "OC Water Features",
    "image": "https://ocwaterfeatures.com/logos/logo.png",
    "@id": "https://ocwaterfeatures.com/#organization",
    "url": "https://ocwaterfeatures.com",
    "telephone": "(714) XXX-XXXX",
    "email": "info@ocwaterfeatures.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Orange County",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoShape",
      "region": "Southern California"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "07:00",
      "closes": "17:00"
    },
    "sameAs": [],
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Orange County"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Southern California"
      }
    ],
    "description": "Family-operated residential and commercial water feature maintenance, repair, and restoration company with industry experience since 1992."
  };
}
