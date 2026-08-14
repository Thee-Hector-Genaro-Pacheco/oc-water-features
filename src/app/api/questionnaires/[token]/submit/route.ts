import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashQuestionnaireToken } from "@/lib/questionnaire/tokens";
import { questionnaireSubmissionSchema } from "@/schemas/questionnaire";
import { sendQuestionnaireCompletionNotification } from "@/lib/email/sendQuestionnaireCompletionNotification";
import { sendQuestionnaireConfirmation } from "@/lib/email/sendQuestionnaireConfirmation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    const parseResult = questionnaireSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const tokenHash = hashQuestionnaireToken(token);
    const supabase = createAdminClient();

    const { data: qRecord, error: qError } = await supabase
      .from("questionnaires")
      .select("*")
      .eq("token_hash", tokenHash)
      .single();

    if (qError || !qRecord) {
      return NextResponse.json({ error: "Invalid or expired questionnaire link" }, { status: 404 });
    }

    if (qRecord.status === "submitted") {
      return NextResponse.json({ error: "This questionnaire has already been submitted." }, { status: 400 });
    }

    if (new Date(qRecord.expires_at) < new Date() || qRecord.status === "revoked") {
      return NextResponse.json({ error: "This questionnaire link has expired or been revoked." }, { status: 410 });
    }

    const { data: lead } = await supabase
      .from("leads")
      .select("id, full_name, email")
      .eq("id", qRecord.lead_id)
      .single();

    const { error: updateError } = await supabase
      .from("questionnaires")
      .update({
        service_requested: data.serviceRequested,
        service_requested_other_detail: data.serviceRequestedOtherDetail || null,
        property_type: data.propertyType,
        water_feature_age: data.waterFeatureAge,
        issue_duration: data.issueDuration,
        operating_condition: data.operatingCondition,
        leak_condition: data.leakCondition,
        previous_service_status: data.previousServiceStatus,
        previous_service_explanation: data.previousServiceExplanation || null,
        maintenance_frequency: data.maintenanceFrequency,
        preferred_contact_method: data.preferredContactMethod,
        preferred_contact_time: data.preferredContactTime,
        additional_notes: data.additionalNotes || null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", qRecord.id);

    if (updateError) {
      console.error("Questionnaire update error:", updateError.message);
      return NextResponse.json({ error: "Failed to save questionnaire" }, { status: 500 });
    }

    // Both notifications run after the questionnaire is already saved — a
    // delivery failure here must never turn into an error response for the
    // customer, matching the existing lead/review notification pattern.
    if (lead) {
      const completionResult = await sendQuestionnaireCompletionNotification({
        leadId: lead.id,
        leadName: lead.full_name,
        serviceRequested: data.serviceRequested,
        propertyType: data.propertyType,
        submittedAt: new Date().toISOString(),
      });
      if (!completionResult.success) {
        console.error("[API /questionnaires/submit] Business notification failed:", { leadId: lead.id });
      }

      const confirmationResult = await sendQuestionnaireConfirmation({
        customerName: lead.full_name,
        customerEmail: lead.email,
      });
      if (!confirmationResult.success) {
        console.error("[API /questionnaires/submit] Customer confirmation failed:", { leadId: lead.id });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your responses have been received.",
    });
  } catch (err: unknown) {
    console.error("API /questionnaires/[token]/submit error:", err);
    return NextResponse.json({ error: "An error occurred while submitting your responses" }, { status: 500 });
  }
}
