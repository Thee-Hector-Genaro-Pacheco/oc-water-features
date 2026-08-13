import React from "react";
import { Metadata } from "next";

// /review/[token] pages contain single-use, guessable-format review-request
// tokens in the URL. They must never be indexed or followed — indexing could
// expose a customer's review-submission link to search engines. The child
// page is a client component ("use client"), so metadata must be declared
// here in the nearest server-component layout instead.
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

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
