import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReviewRequest } from "@/lib/email/sendReviewRequest";
import { generateReviewToken } from "@/lib/reviews/tokens";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function POST(request: NextRequest) {
  // Service-role mutation (bypasses RLS via createAdminClient) — must be
  // gated by the same admin-auth guard used elsewhere before any DB write
  // or email send below.
  await requireAdmin();

  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    const { data: customer, error: custError } = await adminSupabase
      .from("customers")
      .select("id, full_name, email")
      .eq("id", customerId)
      .single();

    if (custError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Use token generation utility
    const { rawToken, tokenHash } = generateReviewToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: reqRecord, error: reqError } = await adminSupabase
      .from("review_requests")
      .insert({
        customer_id: customerId,
        token_hash: tokenHash,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (reqError) {
      console.error("Review request DB error:", reqError.message);
      return NextResponse.json({ error: "Failed to store review request record" }, { status: 500 });
    }

    const emailResult = await sendReviewRequest({
      customerName: customer.full_name,
      customerEmail: customer.email,
      serviceType: "Water Feature Service",
      rawToken,
    });

    if (emailResult.success) {
      await adminSupabase
        .from("review_requests")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", reqRecord.id);
    }

    return NextResponse.json({
      success: true,
      link: emailResult.link,
      requestId: reqRecord.id,
    });
  } catch (err: unknown) {
    console.error("API /admin/reviews/generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
