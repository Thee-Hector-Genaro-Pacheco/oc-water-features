import { Metadata } from "next";

const siteUrl = "https://ocwaterfeatures.com";
const defaultTitle = "OC Water Features | Professional Water Feature Maintenance & Repair";
const defaultDescription =
  "Trusted residential and commercial fountain, pond, waterfall, and water-feature specialists with industry experience since 1992.";

export function constructMetadata({
  title = defaultTitle,
  description = defaultDescription,
  canonical = "/",
  ogImage = "/logos/logo.png"
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
  };
}
