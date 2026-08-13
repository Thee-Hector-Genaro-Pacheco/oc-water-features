import { Metadata } from "next";
import { companyData } from "@/data/company";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ocwaterfeatures.com";
const defaultTitle = "OC Water Features | Professional Water Feature Maintenance & Repair";
const defaultDescription = companyData.shortDescription;
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export function constructMetadata({
  title = defaultTitle,
  description = defaultDescription,
  canonical = "/",
  ogImage = "/logos/OCWaterFeatLogo.png"
}: {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
} = {}): Metadata {
  const fullTitle = title.includes("OC Water Features") ? title : `${title} | OC Water Features`;
  const url = `${siteUrl}${canonical}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "OC Water Features",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "OC Water Features Logo & Banner",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // Google Search Console HTML-tag verification. Only emitted when
    // GOOGLE_SITE_VERIFICATION is set (see .env.example) — Hector must obtain
    // this value from Search Console after adding the property. Absent by
    // default so no fake/placeholder verification tag is ever shipped.
    ...(googleSiteVerification
      ? { verification: { google: googleSiteVerification } }
      : {}),
  };
}
