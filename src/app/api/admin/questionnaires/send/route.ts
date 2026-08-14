import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createOrResendQuestionnaire } from "@/lib/questionnaire/dispatch";

export async function POST(request: NextRequest) {
  // Service-role mutation — must be gated the same way as
  // /api/admin/reviews/generate before any DB write or email send below.
  const { profile } = await requireAdmin();

  try {
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    const { data: lead, error: leadError } = await adminSupabase
      .from("leads")
      .select("id, full_name, email")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const result = await createOrResendQuestionnaire(adminSupabase, {
      leadId: lead.id,
      leadName: lead.full_name,
      leadEmail: lead.email,
      createdBy: profile.id,
    });

    if (result.outcome === "already_submitted") {
      return NextResponse.json(
        { error: "This lead has already completed the questionnaire — resend is not available." },
        { status: 409 }
      );
    }

    if (result.outcome === "error") {
      return NextResponse.json({ error: "Failed to send questionnaire" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deliveryMode: result.deliveryMode,
      link: result.link,
      questionnaireId: result.questionnaireId,
    });
  } catch (err: unknown) {
    console.error("API /admin/questionnaires/send error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
