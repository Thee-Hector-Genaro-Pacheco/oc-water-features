import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Inbox,
  TrendingUp,
  Briefcase,
  Star,
  Filter,
  BarChart3
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Fetch real counts from Supabase database
  const { data: leads } = await supabase.from("leads").select("*");
  const { data: jobs } = await supabase.from("jobs").select("*");
  const { data: reviewReqs } = await supabase.from("review_requests").select("*");

  const allLeads = leads || [];
  const allJobs = jobs || [];
  const allReviews = reviewReqs || [];

  // Metrics Calculations
  const newLeads = allLeads.filter((l) => l.status === "new").length;
  const contactedLeads = allLeads.filter((l) => l.status === "contacted").length;
  const estimatesScheduled = allLeads.filter((l) => l.status === "estimate_scheduled").length;
  const wonLeads = allLeads.filter((l) => l.status === "won" || l.status === "active_client").length;
  const totalLeadsCount = allLeads.length;

  const conversionRate = totalLeadsCount > 0 ? ((wonLeads / totalLeadsCount) * 100).toFixed(1) : "0.0";
  const completedJobs = allJobs.filter((j) => j.job_status === "completed").length;
  const reviewsRequested = allReviews.length;
  const reviewsSubmitted = allReviews.filter((r) => r.status === "submitted").length;

  // SEO Attribution Grouping
  const leadsBySource: Record<string, number> = {};
  const leadsByCity: Record<string, number> = {};
  const leadsByService: Record<string, number> = {};

  allLeads.forEach((l) => {
    const src = l.utm_source || l.referrer || "Direct Website Submission";
    leadsBySource[src] = (leadsBySource[src] || 0) + 1;

    const city = l.city || "Unknown City";
    leadsByCity[city] = (leadsByCity[city] || 0) + 1;

    const svc = l.service_requested || "General Inquiry";
    leadsByService[svc] = (leadsByService[svc] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time lead status, conversion metrics, job pipeline, and marketing attribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>Manage Leads ({newLeads} New)</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{newLeads}</p>
          <p className="text-xs text-slate-500 mt-1">Awaiting initial response</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Conversion Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{conversionRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{wonLeads} won out of {totalLeadsCount} total leads</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed Jobs
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{completedJobs}</p>
          <p className="text-xs text-slate-500 mt-1">Full service history</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reviews Submitted
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{reviewsSubmitted}</p>
          <p className="text-xs text-slate-500 mt-1">{reviewsRequested} review links sent</p>
        </div>
      </div>

      {/* Detailed Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pipeline Progress Stages */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-600" />
            <span>Lead Status Pipeline</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Contacted</span>
              <span className="font-bold text-slate-900 px-3 py-1 bg-white rounded-lg border border-slate-200">{contactedLeads}</span>
            </div>

            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Estimate Scheduled</span>
              <span className="font-bold text-slate-900 px-3 py-1 bg-white rounded-lg border border-slate-200">{estimatesScheduled}</span>
            </div>

            <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Won / Active Clients</span>
              <span className="font-bold text-emerald-700 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">{wonLeads}</span>
            </div>
          </div>
        </div>

        {/* SEO Marketing Attribution Report */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-600" />
            <span>SEO Marketing Attribution</span>
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Leads by Source:
              </h3>
              {Object.keys(leadsBySource).length === 0 ? (
                <p className="text-xs text-slate-500 italic">No lead attribution recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(leadsBySource).map(([src, count]) => (
                    <div key={src} className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{src}</span>
                      <span className="text-brand-600">{count} lead(s)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Top Service Demand:
              </h3>
              {Object.keys(leadsByService).length === 0 ? (
                <p className="text-xs text-slate-500 italic">No service inquiries yet.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(leadsByService).map(([svc, count]) => (
                    <div key={svc} className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{svc}</span>
                      <span className="text-brand-600">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
