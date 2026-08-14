import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashQuestionnaireToken } from "@/lib/questionnaire/tokens";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const tokenHash = hashQuestionnaireToken(token);
    const supabase = createAdminClient();

    const { data: qRecord } = await supabase
      .from("questionnaires")
      .select("id, status")
      .eq("token_hash", tokenHash)
      .single();

    if (qRecord && (qRecord.status === "sent" || qRecord.status === "pending")) {
      await supabase
        .from("questionnaires")
        .update({
          status: "opened",
          opened_at: new Date().toISOString(),
        })
        .eq("id", qRecord.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
