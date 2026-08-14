"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  MessageSquare,
  ClipboardList,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const statusOptions = [
  "new",
  "contacted",
  "estimate_scheduled",
  "estimate_sent",
  "won",
  "lost",
  "active_client",
  "completed",
  "spam",
  "duplicate"
];

export interface LeadDetail {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  service_address?: string;
  property_type: string;
  service_requested: string;
  message: string;
  preferred_contact_method: string;
  status: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  activity_type: string;
  notes?: string;
  old_status?: string;
  new_status?: string;
  created_at: string;
}

export interface QuestionnaireDetail {
  id: string;
  status: string;
  service_requested?: string[];
  service_requested_other_detail?: string;
  property_type?: string;
  water_feature_age?: string;
  issue_duration?: string;
  operating_condition?: string;
  leak_condition?: string;
  previous_service_status?: string;
  previous_service_explanation?: string;
  maintenance_frequency?: string;
  preferred_contact_method?: string;
  preferred_contact_time?: string;
  additional_notes?: string;
  sent_at?: string;
  opened_at?: string;
  submitted_at?: string;
  expires_at: string;
}

export default function AdminLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [sendingQuestionnaire, setSendingQuestionnaire] = useState(false);
  const [questionnaireError, setQuestionnaireError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchLeadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: leadData } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    const { data: activityData } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    const { data: questionnaireData } = await supabase
      .from("questionnaires")
      .select("*")
      .eq("lead_id", leadId)
      .maybeSingle();

    if (leadData) setLead(leadData as LeadDetail);
    if (activityData) setActivities(activityData as LeadActivity[]);
    setQuestionnaire((questionnaireData as QuestionnaireDetail) || null);

    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchLeadData();
  }, [fetchLeadData]);

  const handleStatusChange = async (newStatus: string) => {
    if (!lead || lead.status === newStatus) return;
    setUpdating(true);
    setActionSuccess(null);

    const supabase = createClient();
    const oldStatus = lead.status;

    const { error: updateError } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (!updateError) {
      await supabase.from("lead_activities").insert({
        lead_id: leadId,
        activity_type: "status_changed",
        old_status: oldStatus,
        new_status: newStatus,
        notes: `Status updated from ${oldStatus} to ${newStatus}`,
      });

      setActionSuccess(`Status updated to ${newStatus}`);
      fetchLeadData();
    }
    setUpdating(false);
  };

  const handleSendQuestionnaire = async () => {
    setSendingQuestionnaire(true);
    setQuestionnaireError(null);
    setActionSuccess(null);

    try {
      const response = await fetch("/api/admin/questionnaires/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setQuestionnaireError(resData.error || "Unable to send questionnaire.");
        setSendingQuestionnaire(false);
        return;
      }

      const deliveryNote =
        resData.deliveryMode === "sent"
          ? "Questionnaire email sent."
          : resData.deliveryMode === "dev_logger"
          ? "Questionnaire queued (email not configured — dev logger only)."
          : "Questionnaire link generated, but the email failed to send.";

      setActionSuccess(deliveryNote);
      fetchLeadData();
    } catch {
      setQuestionnaireError("Network error. Please try again.");
    } finally {
      setSendingQuestionnaire(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setUpdating(true);
    setActionSuccess(null);

    const supabase = createClient();
    const { error } = await supabase.from("lead_activities").insert({
      lead_id: leadId,
      activity_type: "note_added",
      notes: newNote.trim(),
    });

    if (!error) {
      setNewNote("");
      setActionSuccess("Note added to activity history");
      fetchLeadData();
    }
    setUpdating(false);
  };

  const handleConvertToCustomer = async () => {
    if (!lead) return;
    setUpdating(true);
    setActionSuccess(null);

    const supabase = createClient();

    const { data: newCust, error: custError } = await supabase
      .from("customers")
      .insert({
        original_lead_id: lead.id,
        full_name: lead.full_name,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        service_address: lead.service_address || null,
        notes: `Converted from Lead #${lead.id}. ${lead.message}`,
        customer_status: "active",
      })
      .select()
      .single();

    if (custError) {
      alert("Error converting lead to customer: " + custError.message);
      setUpdating(false);
      return;
    }

    await supabase.from("leads").update({ status: "won" }).eq("id", leadId);

    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      activity_type: "converted_to_customer",
      notes: `Lead successfully converted to Customer #${newCust.id}`,
      old_status: lead.status,
      new_status: "won",
    });

    setActionSuccess("Lead successfully converted to Customer!");
    router.push(`/admin/customers/${newCust.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading lead details...</div>;
  }

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Lead Record Not Found</h2>
        <Link href="/admin/leads" className="text-brand-600 hover:underline">
          Return to Leads Index
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Leads</span>
        </Link>

        {lead.status !== "won" && lead.status !== "active_client" && (
          <Button onClick={handleConvertToCustomer} disabled={updating} variant="accent" size="sm">
            <UserCheck className="w-4 h-4 mr-2" />
            <span>Convert Won Lead to Customer</span>
          </Button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Details + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lead Info Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Lead ID: {lead.id.slice(0, 8)}...
              </span>
              <h1 className="text-2xl font-extrabold text-navy-900">{lead.full_name}</h1>
              <p className="text-sm font-semibold text-brand-600 mt-1">{lead.service_requested}</p>
            </div>

            <div className="space-y-2 text-right">
              <label htmlFor="status-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Update Status
              </label>
              <select
                id="status-select"
                value={lead.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold uppercase tracking-wider bg-white focus:outline-none focus:border-brand-600"
              >
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact & Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Phone</span>
                <a href={`tel:${lead.phone}`} className="font-bold text-slate-900 hover:underline">
                  {lead.phone}
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Email</span>
                <a href={`mailto:${lead.email}`} className="font-bold text-slate-900 hover:underline text-xs">
                  {lead.email}
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">City & Property</span>
                <span className="font-bold text-slate-900">{lead.city} ({lead.property_type})</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Preferred Contact</span>
                <span className="font-bold text-slate-900">{lead.preferred_contact_method}</span>
              </div>
            </div>
          </div>

          {/* Message / Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Customer Message / Request Description:
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed italic">
              &ldquo;{lead.message}&rdquo;
            </div>
          </div>

          {/* Attribution Metadata */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] mb-2">
              Attribution Metadata:
            </h3>
            <p><strong>UTM Source:</strong> {lead.utm_source || "None"}</p>
            <p><strong>UTM Medium:</strong> {lead.utm_medium || "None"}</p>
            <p><strong>UTM Campaign:</strong> {lead.utm_campaign || "None"}</p>
            <p><strong>Referrer:</strong> {lead.referrer || "Direct Website"}</p>
          </div>
        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Intake Questionnaire */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-brand-600" />
                <span>Intake Questionnaire</span>
              </h3>
              {questionnaire && (
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    questionnaire.status === "submitted"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : questionnaire.status === "expired" || questionnaire.status === "revoked"
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {questionnaire.status}
                </span>
              )}
            </div>

            {questionnaireError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {questionnaireError}
              </div>
            )}

            {questionnaire?.status === "submitted" ? (
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong>Service(s):</strong> {questionnaire.service_requested?.join(", ") || "—"}</p>
                {questionnaire.service_requested_other_detail && (
                  <p><strong>Other detail:</strong> {questionnaire.service_requested_other_detail}</p>
                )}
                <p><strong>Property Type:</strong> {questionnaire.property_type}</p>
                <p><strong>Water Feature Age:</strong> {questionnaire.water_feature_age}</p>
                <p><strong>Issue Duration:</strong> {questionnaire.issue_duration}</p>
                <p><strong>Operating Condition:</strong> {questionnaire.operating_condition}</p>
                <p><strong>Leak Condition:</strong> {questionnaire.leak_condition}</p>
                <p><strong>Previously Serviced:</strong> {questionnaire.previous_service_status}</p>
                {questionnaire.previous_service_explanation && (
                  <p><strong>Previous Service Notes:</strong> {questionnaire.previous_service_explanation}</p>
                )}
                <p><strong>Maintenance Frequency:</strong> {questionnaire.maintenance_frequency}</p>
                <p><strong>Preferred Contact:</strong> {questionnaire.preferred_contact_method} ({questionnaire.preferred_contact_time})</p>
                {questionnaire.additional_notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <strong>Additional Notes:</strong>
                    <p className="italic mt-1">&ldquo;{questionnaire.additional_notes}&rdquo;</p>
                  </div>
                )}
                <p className="pt-2 text-[10px] text-slate-400">
                  Submitted {questionnaire.submitted_at ? new Date(questionnaire.submitted_at).toLocaleString() : ""}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  {questionnaire
                    ? `Not yet completed by the customer${questionnaire.sent_at ? ` (last sent ${new Date(questionnaire.sent_at).toLocaleDateString()})` : ""}.`
                    : "No questionnaire has been sent yet."}
                </p>
                <Button
                  onClick={handleSendQuestionnaire}
                  disabled={sendingQuestionnaire}
                  variant="outline"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>{sendingQuestionnaire ? "Sending..." : questionnaire ? "Resend Questionnaire" : "Send Questionnaire"}</span>
                </Button>
              </>
            )}
          </div>

          {/* Add Internal Note Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Add Internal Activity Note</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log phone call results, inspection scheduling details..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
              />
              <Button type="submit" variant="primary" size="sm" disabled={updating || !newNote.trim()}>
                <Plus className="w-4 h-4 mr-1" />
                <span>Save Internal Note</span>
              </Button>
            </form>
          </div>

          {/* Audit Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-navy-900">
              Audit Timeline ({activities.length})
            </h3>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No activity entries yet.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="capitalize">{act.activity_type.replace("_", " ")}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>
                    {act.notes && <p className="text-slate-600">{act.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
