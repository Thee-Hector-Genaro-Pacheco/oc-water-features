import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const reviewSubmitSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(5, "Review text must be at least 5 characters").max(2000),
  displayName: z.string().min(2, "Display name is required").max(100),
  city: z.string().min(2, "City is required").max(100),
  permissionToPublish: z.boolean().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    const parseResult = reviewSubmitSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const supabase = createAdminClient();

    const { data: reqRecord, error: reqError } = await supabase
      .from("review_requests")
      .select("*")
      .eq("token_hash", tokenHash)
      .single();

    if (reqError || !reqRecord) {
      return NextResponse.json({ error: "Invalid or expired review link" }, { status: 404 });
    }

    if (reqRecord.status === "submitted") {
      return NextResponse.json({ error: "This review request has already been submitted." }, { status: 400 });
    }

    if (new Date(reqRecord.expires_at) < new Date() || reqRecord.status === "revoked") {
      return NextResponse.json({ error: "This review request link has expired or been revoked." }, { status: 410 });
    }

    const { data: testimonialRecord, error: testError } = await supabase
      .from("testimonials")
      .insert({
        customer_id: reqRecord.customer_id,
        job_id: reqRecord.job_id || null,
        rating: data.rating,
        review_text: data.reviewText.trim(),
        display_name: data.displayName.trim(),
        city: data.city.trim(),
        permission_to_publish: data.permissionToPublish,
        approved: false,
      })
      .select()
      .single();

    if (testError) {
      console.error("Testimonial insert error:", testError.message);
      return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }

    await supabase
      .from("review_requests")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", reqRecord.id);

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback!",
      testimonialId: testimonialRecord?.id,
    });
  } catch (err: unknown) {
    console.error("API /reviews/[token]/submit error:", err);
    return NextResponse.json({ error: "An error occurred while submitting your review" }, { status: 500 });
  }
}
