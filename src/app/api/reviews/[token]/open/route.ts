import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashReviewToken } from "@/lib/reviews/tokens";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const tokenHash = hashReviewToken(token);
    const supabase = createAdminClient();

    const { data: reqRecord } = await supabase
      .from("review_requests")
      .select("id, status")
      .eq("token_hash", tokenHash)
      .single();

    if (reqRecord && (reqRecord.status === "sent" || reqRecord.status === "pending")) {
      await supabase
        .from("review_requests")
        .update({
          status: "opened",
          opened_at: new Date().toISOString(),
        })
        .eq("id", reqRecord.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
