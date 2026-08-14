import { createAdminClient } from "@/lib/supabase/admin";
import { generateQuestionnaireToken } from "@/lib/questionnaire/tokens";
import { sendQuestionnaireInvite } from "@/lib/email/sendQuestionnaireInvite";

const QUESTIONNAIRE_EXPIRY_DAYS = 14;

export interface DispatchQuestionnaireParams {
  leadId: string;
  leadName: string;
  leadEmail: string;
  createdBy?: string | null;
}

export interface DispatchQuestionnaireResult {
  outcome: "sent" | "queued" | "already_submitted" | "error";
  deliveryMode?: "sent" | "dev_logger" | "failed";
  link?: string;
  questionnaireId?: string;
}

/**
 * Creates a questionnaire row for a lead (or rotates the token on an
 * existing, not-yet-submitted one) and sends the invite email. One
 * questionnaire per lead — lead_id is UNIQUE in the database as the
 * authoritative safety net.
 *
 * status only ever becomes "sent" (and sent_at only ever gets populated)
 * when the invite email's deliveryMode === "sent" — a dev-logger fallback
 * or a failed send leaves the row honestly at "pending".
 */
export async function createOrResendQuestionnaire(
  adminSupabase: ReturnType<typeof createAdminClient>,
  params: DispatchQuestionnaireParams
): Promise<DispatchQuestionnaireResult> {
  const { leadId, leadName, leadEmail, createdBy = null } = params;

  const { data: existing } = await adminSupabase
    .from("questionnaires")
    .select("id, status")
    .eq("lead_id", leadId)
    .maybeSingle();

  if (existing?.status === "submitted") {
    return { outcome: "already_submitted", questionnaireId: existing.id };
  }

  const { rawToken, tokenHash } = generateQuestionnaireToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + QUESTIONNAIRE_EXPIRY_DAYS);

  let questionnaireId: string;

  if (existing) {
    // Resend: rotate the token so a previously emailed link stops working
    // and reset the expiry. Answer fields are never touched here — this
    // branch is unreachable once status === "submitted" (checked above).
    const { data: updated, error: updateError } = await adminSupabase
      .from("questionnaires")
      .update({
        token_hash: tokenHash,
        status: "pending",
        sent_at: null,
        expires_at: expiresAt.toISOString(),
        created_by: createdBy,
      })
      .eq("id", existing.id)
      .select("id")
      .single();

    if (updateError || !updated) {
      console.error("[Questionnaire Dispatch] Failed to update existing record:", {
        leadId,
        error: updateError?.message,
      });
      return { outcome: "error" };
    }
    questionnaireId = updated.id;
  } else {
    const { data: inserted, error: insertError } = await adminSupabase
      .from("questionnaires")
      .insert({
        lead_id: leadId,
        token_hash: tokenHash,
        status: "pending",
        expires_at: expiresAt.toISOString(),
        created_by: createdBy,
      })
      .select("id")
      .single();

    if (insertError) {
      // Unique-violation race: another request created the row for this
      // lead between our SELECT and this INSERT. Re-run once, which will
      // now find the row and take the update/rotate path above.
      if (insertError.code === "23505") {
        return createOrResendQuestionnaire(adminSupabase, params);
      }
      console.error("[Questionnaire Dispatch] Failed to insert new record:", {
        leadId,
        error: insertError.message,
      });
      return { outcome: "error" };
    }
    questionnaireId = inserted.id;
  }

  const emailResult = await sendQuestionnaireInvite({
    leadId,
    leadName,
    leadEmail,
    rawToken,
  });

  if (emailResult.deliveryMode === "sent") {
    await adminSupabase
      .from("questionnaires")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", questionnaireId);
  }

  return {
    outcome: emailResult.deliveryMode === "sent" ? "sent" : "queued",
    deliveryMode: emailResult.deliveryMode,
    link: emailResult.link,
    questionnaireId,
  };
}
