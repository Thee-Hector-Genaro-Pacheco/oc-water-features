import React from "react";
import { Metadata } from "next";

// /questionnaire/[token] pages contain single-use, guessable-format intake
// tokens in the URL. They must never be indexed or followed — indexing
// could expose a lead's questionnaire link to search engines. The child
// page is a client component ("use client"), so metadata must be declared
// here in the nearest server-component layout instead — see
// src/app/review/layout.tsx for the same pattern.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
