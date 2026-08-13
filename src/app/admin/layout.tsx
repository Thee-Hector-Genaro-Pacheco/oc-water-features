import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  Settings,
  LogOut,
  Inbox,
  Globe
} from "lucide-react";

// The entire /admin/* route tree is a private, authenticated back office —
// never a public marketing surface. Block indexing here so it applies to
// every current and future page under this layout, regardless of whether
// the individual page defines its own metadata.
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-navy-900 text-white shrink-0 border-r border-navy-800 flex flex-col justify-between p-4 sm:p-6">
        <div className="space-y-8">
          {/* Header Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-white rounded-xl p-1 shrink-0">
              <Image
                src="/logos/OCWaterFeatLogo.png"
                alt="OC Water Features Emblem"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                OC WATER FEATURES
              </span>
              <span className="text-[10px] text-aqua-400 font-semibold uppercase tracking-wider block">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Admin Portal Navigation">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-aqua-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Inbox className="w-4 h-4 text-aqua-400" />
              <span>Leads Management</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Users className="w-4 h-4 text-aqua-400" />
              <span>Customers</span>
            </Link>

            <Link
              href="/admin/jobs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-aqua-400" />
              <span>Jobs Pipeline</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Star className="w-4 h-4 text-aqua-400" />
              <span>Review Requests</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-aqua-400" />
              <span>System Settings</span>
            </Link>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>View Public Site</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Profile Card & Sign Out */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white leading-tight">{profile.full_name}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-600/40 text-aqua-300 border border-brand-500/30">
              {profile.role}
            </span>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
