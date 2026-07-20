import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReviewRequest } from "@/lib/email/sendReviewRequest";

export async function POST(request: NextRequest) {
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

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

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
