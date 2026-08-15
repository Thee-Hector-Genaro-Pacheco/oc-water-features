import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

// /request-estimate is a client component ("use client", uses useState/useRef
// for the estimate form), so metadata must be declared here in the nearest
// server-component layout instead — see src/app/projects/layout.tsx and
// src/app/review/layout.tsx for the same pattern. Without this file the page
// silently inherited the root layout's homepage title/canonical instead of
// its own.
export const metadata: Metadata = constructMetadata({
  title: "Request a Free Estimate",
  description:
    "Request a free estimate for fountain, pond, or water feature maintenance and repair in Orange County and Los Angeles County. Our family team responds promptly with expert advice.",
  canonical: "/request-estimate"
});

export default function RequestEstimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
