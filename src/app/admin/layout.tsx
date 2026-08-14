import React from "react";
import { Metadata } from "next";

// The entire /admin/* route tree is a private, authenticated back office —
// never a public marketing surface. Block indexing here so it applies to
// every current and future page under this layout, including /admin/login,
// regardless of whether the individual page defines its own metadata.
//
// This layout is deliberately auth-free: the actual requireAdmin() guard
// lives one level down, in src/app/admin/(protected)/layout.tsx, which
// wraps every real back-office page but NOT /admin/login. Putting the guard
// here (as before) meant it also wrapped /admin/login itself — an
// unauthenticated visitor redirected to /admin/login by requireAdmin()
// would immediately re-trigger the same guard on /admin/login, looping
// forever (ERR_TOO_MANY_REDIRECTS). See src/app/admin/(protected)/layout.tsx
// for the guard.
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
