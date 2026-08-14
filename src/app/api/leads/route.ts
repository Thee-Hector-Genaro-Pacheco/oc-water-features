import { NextRequest, NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/schemas/lead";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadNotification } from "@/lib/email/sendLeadNotification";
import { createOrResendQuestionnaire } from "@/lib/questionnaire/dispatch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation & Normalization
    const parseResult = leadSubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 2. Honeypot check (Spam Protection)
    if (data.website_hp && data.website_hp.length > 0) {
      return NextResponse.json({ success: true, message: "Request received" }, { status: 200 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // 3. Fallback for Local Dev / Missing Database Credentials
    // No questionnaire invite is dispatched in this branch — there is no
    // database to persist a questionnaire row against (the synthetic
    // "demo-lead-id" isn't a real leads.id), so a submittable link could
    // never actually work.
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
      console.log("[Dev Mode] Lead received successfully (Supabase credentials not configured yet):", {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        service: data.serviceRequested,
      });

      await sendLeadNotification({
        id: "demo-lead-id",
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        property_type: data.propertyType,
        service_requested: data.serviceRequested,
        message: data.message,
        preferred_contact_method: data.preferredContactMethod,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your estimate request has been recorded.",
          mode: "demo_fallback",
        },
        { status: 200 }
      );
    }

    // 4. Production Supabase Insertion
    const adminSupabase = createAdminClient();

    const { data: leadRecord, error: insertError } = await adminSupabase
      .from("leads")
      .insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        service_address: data.serviceAddress || null,
        property_type: data.propertyType,
        service_requested: data.serviceRequested,
        message: data.message,
        preferred_contact_method: data.preferredContactMethod,
        landing_page: data.landingPage || null,
        referrer: data.referrer || null,
        utm_source: data.utmSource || null,
        utm_medium: data.utmMedium || null,
        utm_campaign: data.utmCampaign || null,
        utm_term: data.utmTerm || null,
        utm_content: data.utmContent || null,
        status: "new",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError.message);
      return NextResponse.json(
        { error: "Unable to process request. Please try again or call us directly." },
        { status: 500 }
      );
    }

    if (leadRecord) {
      await adminSupabase.from("lead_activities").insert({
        lead_id: leadRecord.id,
        activity_type: "created",
        notes: "Lead submitted via public website estimate form",
        new_status: "new",
      });

      // The lead is already safely persisted above — a notification failure
      // must never turn this into an error response or lose the lead. Any
      // failure is logged server-side (see sendLeadNotification) so it can
      // be followed up on without exposing provider errors to the customer.
      const notificationResult = await sendLeadNotification(leadRecord);
      if (!notificationResult.success) {
        console.error("[API /leads] Lead saved but notification delivery failed:", {
          leadId: leadRecord.id,
        });
      }

      // Second-stage intake questionnaire invite — also non-blocking. The
      // lead is already saved above, so a failure here (DB or email) must
      // never turn this into an error response or lose the lead.
      try {
        const questionnaireResult = await createOrResendQuestionnaire(adminSupabase, {
          leadId: leadRecord.id,
          leadName: leadRecord.full_name,
          leadEmail: leadRecord.email,
        });
        if (questionnaireResult.outcome === "error") {
          console.error("[API /leads] Questionnaire invite dispatch failed:", {
            leadId: leadRecord.id,
          });
        }
      } catch (err: unknown) {
        console.error("[API /leads] Questionnaire invite dispatch threw:", {
          leadId: leadRecord.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your estimate request has been received.",
        leadId: leadRecord?.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /leads route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
