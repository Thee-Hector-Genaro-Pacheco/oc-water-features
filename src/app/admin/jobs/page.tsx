"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Briefcase, Filter } from "lucide-react";

export interface MasterJobRecord {
  id: string;
  service_type: string;
  description?: string;
  estimate_amount?: number;
  final_amount?: number;
  job_status: string;
  scheduled_date?: string;
  customers?: {
    id: string;
    full_name: string;
    phone: string;
    city: string;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<MasterJobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("jobs")
      .select("*, customers(id, full_name, phone, city)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data as MasterJobRecord[]);
    }
    setLoading(false);
  };

  const filteredJobs = jobs.filter((job) => {
    return statusFilter === "all" || job.job_status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Jobs Pipeline & Contracts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track estimate stages, scheduled service dates, and final amounts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white"
          >
            <option value="all">All Job Statuses</option>
            <option value="estimate">Estimate</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing {filteredJobs.length} contract(s)
        </span>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading jobs dataset...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Jobs Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a job contract inside any client profile in the Customers tab.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Service Type</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Estimate Amount</th>
                  <th className="py-3.5 px-4">Final Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Scheduled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{job.service_type}</span>
                      {job.description && (
                        <span className="text-xs text-slate-500 truncate max-w-xs block">
                          {job.description}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {job.customers ? (
                        <Link
                          href={`/admin/customers/${job.customers.id}`}
                          className="font-semibold text-brand-600 hover:underline block text-xs"
                        >
                          {job.customers.full_name} ({job.customers.city})
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700 text-xs">
                      {job.estimate_amount !== undefined && job.estimate_amount !== null ? `$${Number(job.estimate_amount).toFixed(2)}` : "—"}
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-700 text-xs">
                      {job.final_amount !== undefined && job.final_amount !== null ? `$${Number(job.final_amount).toFixed(2)}` : "—"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          job.job_status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-brand-100 text-brand-800"
                        }`}
                      >
                        {job.job_status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-xs text-slate-500">
                      {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : "TBD"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
