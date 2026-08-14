import React from "react";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

// /projects is a client component ("use client", uses useState for the
// category filter and project detail modal), so metadata must be declared
// here in the nearest server-component layout instead — see
// src/app/review/layout.tsx for the same pattern.
export const metadata: Metadata = constructMetadata({
  title: "Project Gallery | Water Feature Case Studies",
  description:
    "Explore OC Water Features' portfolio of commercial fountain maintenance, leak repairs, pump replacements, and water-feature restoration projects across Southern California.",
  canonical: "/projects"
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
