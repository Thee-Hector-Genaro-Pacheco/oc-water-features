import { MetadataRoute } from "next";
import { servicesData } from "@/data/services";

export const dynamic = "force-static";

// PHASE 0 AUDIT NOTE: this sitemap intentionally lists only public,
// canonical marketing URLs. It must never include /admin, /api, /review
// token URLs, or any other authenticated/private route — those are blocked
// from indexing separately via robots.ts and per-route `robots: noindex`
// metadata (see src/app/admin/layout.tsx and src/app/review/layout.tsx).
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ocwaterfeatures.com";

  const serviceRoutes = servicesData.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/projects",
    "/service-areas",
    "/request-estimate",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
