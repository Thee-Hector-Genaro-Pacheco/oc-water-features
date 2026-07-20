import React from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, isServerConfigured } from "@/lib/env";
import { Activity, ArrowLeft, CheckCircle2, XCircle, ShieldCheck, Database } from "lucide-react";

export default async function DiagnosticsPage() {
  const { user, profile } = await requireAdmin();

  const supabaseUrlConfigured = isSupabaseConfigured();
  const serverConfigured = isServerConfigured();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrlConfigured = Boolean(siteUrl && !siteUrl.includes("placeholder"));

  const googleReviewUrl = process.env.GOOGLE_REVIEW_URL;
  const googleReviewConfigured = Boolean(googleReviewUrl && !googleReviewUrl.includes("placeholder"));

  const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
  const businessEmailConfigured = Boolean(businessEmail && !businessEmail.includes("placeholder"));

  // Check database reachability
  let dbReachable = false;
  let dbPingTimeMs = 0;

  if (supabaseUrlConfigured) {
    const startTime = Date.now();
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("admin_profiles").select("id").limit(1);
      if (!error) {
        dbReachable = true;
        dbPingTimeMs = Date.now() - startTime;
      }
    } catch {
      dbReachable = false;
    }
  }

  return (
    <div className="space-y-8">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to System Settings</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            System & Database Health Diagnostics
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Environment configuration status and Supabase database connectivity metrics. No secret keys or raw credentials are exposed.
        </p>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Infrastructure */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-brand-600" />
            <span>Database & Auth Infrastructure</span>
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Supabase Configured:</span>
              <span className="flex items-center gap-1.5 font-bold">
                {supabaseUrlConfigured ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yes
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-amber-600" /> No (Local Fallback)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Service Role Key Configured:</span>
              <span className="flex items-center gap-1.5 font-bold">
                {serverConfigured ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yes
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-amber-600" /> No (Placeholder)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Database Reachable:</span>
              <span className="flex items-center gap-1.5 font-bold">
                {dbReachable ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yes ({dbPingTimeMs}ms)
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-slate-400" /> Unreachable / Dev Mode
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* User Auth & External Integrations */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span>Active Session & App Config</span>
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Authenticated User:</span>
              <span className="font-bold text-slate-900 text-xs">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Active Admin Profile Found:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Current Role:</span>
              <span className="font-extrabold uppercase text-xs px-2.5 py-0.5 rounded bg-brand-100 text-brand-800">
                {profile.role}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Site URL Configured:</span>
              <span className="font-bold">{siteUrlConfigured ? "Yes" : "Default / Localhost"}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Google Review URL Configured:</span>
              <span className="font-bold">{googleReviewConfigured ? "Yes" : "Default Placeholder"}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Business Email Configured:</span>
              <span className="font-bold">{businessEmailConfigured ? "Yes" : "Default Placeholder"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
