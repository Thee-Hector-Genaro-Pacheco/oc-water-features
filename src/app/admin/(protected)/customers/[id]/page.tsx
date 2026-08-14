"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Plus,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CustomerDetail {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  service_address?: string;
  customer_status: string;
  created_at: string;
}

export interface JobRecord {
  id: string;
  customer_id: string;
  service_type: string;
  description?: string;
  estimate_amount?: number;
  final_amount?: number;
  scheduled_date?: string;
  completed_date?: string;
  job_status: string;
  created_at: string;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [showJobForm, setShowJobForm] = useState(false);
  const [serviceType, setServiceType] = useState("Fountain Maintenance");
  const [description, setDescription] = useState("");
  const [estimateAmount, setEstimateAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [jobStatus, setJobStatus] = useState("scheduled");
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchCustomerDetails = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: custData } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    const { data: jobData } = await supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (custData) setCustomer(custData as CustomerDetail);
    if (jobData) setJobs(jobData as JobRecord[]);

    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionSuccess(null);

    const supabase = createClient();

    const estNumeric = estimateAmount ? parseFloat(estimateAmount) : null;
    const finalNumeric = finalAmount ? parseFloat(finalAmount) : null;

    const { error } = await supabase.from("jobs").insert({
      customer_id: customerId,
      service_type: serviceType,
      description: description.trim(),
      estimate_amount: estNumeric,
      final_amount: finalNumeric,
      scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null,
      job_status: jobStatus,
    });

    if (!error) {
      setActionSuccess("New job created successfully!");
      setShowJobForm(false);
      setDescription("");
      setEstimateAmount("");
      setFinalAmount("");
      setScheduledDate("");
      fetchCustomerDetails();
    } else {
      alert("Error creating job: " + error.message);
    }
    setSubmitting(false);
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    const supabase = createClient();
    const updatePayload: Record<string, unknown> = { job_status: newStatus };
    if (newStatus === "completed") {
      updatePayload.completed_date = new Date().toISOString();
    }

    const { error } = await supabase
      .from("jobs")
      .update(updatePayload)
      .eq("id", jobId);

    if (!error) {
      setActionSuccess(`Job status updated to ${newStatus}`);
      fetchCustomerDetails();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading client details...</div>;
  if (!customer) return <div className="p-8 text-center text-slate-500">Customer record not found.</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers Directory</span>
        </Link>

        <Button onClick={() => setShowJobForm(!showJobForm)} variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>{showJobForm ? "Cancel Job Form" : "Create New Job Contract"}</span>
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Customer Profile Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Client Profile • {customer.customer_status}
            </span>
            <h1 className="text-2xl font-extrabold text-navy-900">{customer.full_name}</h1>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Client Since: {new Date(customer.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <Phone className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Phone</span>
              <a href={`tel:${customer.phone}`} className="font-bold text-slate-900 hover:underline">
                {customer.phone}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <Mail className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Email</span>
              <a href={`mailto:${customer.email}`} className="font-bold text-slate-900 hover:underline text-xs">
                {customer.email}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">City & Service Address</span>
              <span className="font-bold text-slate-900">{customer.city} {customer.service_address ? `• ${customer.service_address}` : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Job Form */}
      {showJobForm && (
        <form onSubmit={handleCreateJob} className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-200 shadow-lg space-y-6 animate-in slide-in-from-top duration-200">
          <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <span>Create New Job Contract for {customer.full_name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                required
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                placeholder="Fountain Repair, Pond Cleanout..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Initial Job Status
              </label>
              <select
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white"
              >
                <option value="estimate">Estimate</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Estimate Amount ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={estimateAmount}
                onChange={(e) => setEstimateAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                placeholder="450.00"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Final Amount ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                placeholder="450.00"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Scheduled Service Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Job Specifications & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                placeholder="Details on scope of work, parts replaced, basin sealing..."
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" onClick={() => setShowJobForm(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? "Saving Job..." : "Save Job Contract"}
            </Button>
          </div>
        </form>
      )}

      {/* Customer Jobs Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-600" />
          <span>Job History & Active Contracts ({jobs.length})</span>
        </h2>

        {jobs.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-6 text-center">
            No job contracts recorded for this client yet.
          </p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{job.service_type}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        job.job_status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-brand-100 text-brand-800"
                      }`}
                    >
                      {job.job_status}
                    </span>
                  </div>
                  {job.description && (
                    <p className="text-xs text-slate-600">{job.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    {job.estimate_amount !== undefined && job.estimate_amount !== null && (
                      <span>Est: <strong>${Number(job.estimate_amount).toFixed(2)}</strong></span>
                    )}
                    {job.final_amount !== undefined && job.final_amount !== null && (
                      <span>Final: <strong>${Number(job.final_amount).toFixed(2)}</strong></span>
                    )}
                    {job.scheduled_date && (
                      <span>Scheduled: {new Date(job.scheduled_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.job_status !== "completed" && (
                    <Button
                      onClick={() => handleUpdateJobStatus(job.id, "completed")}
                      variant="outline"
                      size="sm"
                      className="text-xs py-1.5"
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
