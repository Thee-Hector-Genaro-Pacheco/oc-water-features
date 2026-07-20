"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, Send, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ReviewCustomerOption {
  id: string;
  full_name: string;
  email: string;
  city: string;
}

export interface ReviewRequestRecord {
  id: string;
  customer_id: string;
  status: string;
  created_at: string;
  customers?: {
    full_name: string;
    email: string;
  };
}

export interface TestimonialRecord {
  id: string;
  rating: number;
  review_text: string;
  display_name: string;
  city: string;
  permission_to_publish: boolean;
  approved: boolean;
}

export default function AdminReviewsPage() {
  const [customers, setCustomers] = useState<ReviewCustomerOption[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequestRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);

  // Review Link Creation Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchReviewData();
  }, []);

  const fetchReviewData = async () => {
    const supabase = createClient();

    const { data: custData } = await supabase.from("customers").select("id, full_name, email, city");
    const { data: reqData } = await supabase.from("review_requests").select("*, customers(full_name, email)").order("created_at", { ascending: false });
    const { data: testData } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });

    if (custData) setCustomers(custData as ReviewCustomerOption[]);
    if (reqData) setReviewRequests(reqData as ReviewRequestRecord[]);
    if (testData) setTestimonials(testData as TestimonialRecord[]);
  };

  const handleGenerateReviewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setGenerating(true);
    setGeneratedLink(null);
    setActionSuccess(null);

    try {
      const response = await fetch("/api/admin/reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: selectedCustomerId }),
      });

      const data = await response.json();

      if (response.ok && data.link) {
        setGeneratedLink(data.link);
        setActionSuccess("Cryptographically secure review request generated!");
        fetchReviewData();
      } else {
        alert("Error generating review request: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Network error generating review link.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTestimonialApproval = async (testimonialId: string, currentApproved: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("testimonials")
      .update({
        approved: !currentApproved,
        approved_at: !currentApproved ? new Date().toISOString() : null,
      })
      .eq("id", testimonialId);

    if (!error) {
      setActionSuccess(`Testimonial ${!currentApproved ? "approved for public display" : "unapproved"}`);
      fetchReviewData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Customer Review Requests & Testimonials
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate secure single-use review links and approve feedback for public website display.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Send className="w-5 h-5 text-brand-600" />
            <span>Generate Secure Review Request</span>
          </h2>

          <form onSubmit={handleGenerateReviewLink} className="space-y-4">
            <div>
              <label htmlFor="customer-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Customer
              </label>
              <select
                id="customer-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white"
              >
                <option value="">Select a customer from directory...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.city} - {c.email})
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="primary" size="md" disabled={generating || !selectedCustomerId} className="w-full justify-center">
              {generating ? "Generating Secure Token..." : "Generate Review Link & Email Request"}
            </Button>
          </form>

          {generatedLink && (
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 space-y-2 text-xs">
              <span className="font-bold text-brand-800 block">Generated Review URL:</span>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-brand-200 overflow-x-auto">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(generatedLink)}
                  className="p-1.5 rounded text-brand-600 hover:bg-brand-50 shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                * Only the SHA-256 hash of this token is stored in the database.
              </p>
            </div>
          )}
        </div>

        {/* Recent Review Requests List */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
            Sent Review Requests ({reviewRequests.length})
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {reviewRequests.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No review requests generated yet.</p>
            ) : (
              reviewRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{req.customers?.full_name || "Customer"}</span>
                    <span className="text-slate-500 text-[11px]">{req.customers?.email}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    req.status === "submitted" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Testimonial Approvals Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>Customer Testimonials & Feedback Approvals ({testimonials.length})</span>
        </h2>

        {testimonials.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            No customer feedback submitted via review links yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((test) => (
              <div key={test.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      test.approved ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {test.approved ? "Approved" : "Pending Approval"}
                    </span>
                  </div>

                  <p className="text-slate-800 text-sm italic mb-3">&ldquo;{test.review_text}&rdquo;</p>
                  <p className="text-xs font-bold text-slate-900">{test.display_name} • {test.city}</p>
                  <p className="text-[11px] text-slate-500">
                    Publish Permission: {test.permission_to_publish ? "Granted" : "Not Granted"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <Button
                    onClick={() => handleToggleTestimonialApproval(test.id, test.approved)}
                    variant={test.approved ? "outline" : "primary"}
                    size="sm"
                    className="w-full justify-center text-xs"
                  >
                    {test.approved ? "Unapprove Testimonial" : "Approve for Public Website"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
