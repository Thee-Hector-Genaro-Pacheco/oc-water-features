import React from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import { ShieldCheck, UserCheck, AlertTriangle, Activity, ChevronRight } from "lucide-react";

export default async function AdminSettingsPage() {
  const { user, profile } = await requireAdmin();
  const supabase = createAdminClient();

  const { data: allAdmins } = await supabase.from("admin_profiles").select("*");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            System Settings & Access Controls
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administrator profile information and owner security governance.
          </p>
        </div>

        <Link
          href="/admin/settings/diagnostics"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Activity className="w-4 h-4 text-aqua-400" />
          <span>System Diagnostics</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-brand-600" />
            <span>Your Administrator Profile</span>
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Full Name</span>
              <span className="font-bold text-slate-900 text-base">{profile.full_name}</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">User Email</span>
              <span className="font-medium text-slate-800">{user.email}</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">System Role</span>
              <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded bg-brand-100 text-brand-800 border border-brand-200 mt-1">
                {profile.role}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Account Status</span>
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Owner Governance Card */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span>Administrator Access Governance</span>
          </h2>

          {profile.role === "owner" ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                As a system <strong>Owner</strong>, you have privilege to manage administrator profile activations. Initial user accounts must be provisioned directly via Supabase Auth.
              </p>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Administrator Profiles ({allAdmins?.length || 0})
                </h3>

                <div className="divide-y divide-slate-100">
                  {allAdmins?.map((adm) => (
                    <div key={adm.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{adm.full_name}</span>
                        <span className="text-slate-500">{adm.role}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        adm.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {adm.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Owner Privileges Required</span>
              </div>
              <p>
                Only the system Owner may manage or create additional administrator profiles. Contact the business owner for access updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
