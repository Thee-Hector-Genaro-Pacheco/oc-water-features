import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export const dynamic = "force-static";

const siteUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Defense in depth only — the definitive protection for these routes is the
      // per-page `robots: { index: false, follow: false }` metadata (see
      // src/app/admin/layout.tsx and src/app/review/layout.tsx), since robots.txt
      // disallow rules do not reliably prevent a URL from being indexed if it is
      // linked to from elsewhere.
      disallow: ["/admin", "/api", "/review"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
