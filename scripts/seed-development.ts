import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

async function runSeed() {
  console.log("------------------------------------------------");
  console.log("OC Water Features — Development Seed Script");
  console.log("------------------------------------------------");

  // 1. Production Safety Check
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL SAFETY BLOCK: Refusing to run dev seed script in production mode!");
    process.exit(1);
  }

  // 2. Explicit Flag Check
  const allowSeed = process.env.ALLOW_DEVELOPMENT_SEED;
  if (allowSeed !== "true") {
    console.error("SAFETY ERROR: ALLOW_DEVELOPMENT_SEED is not set to 'true'.");
    console.error("Set ALLOW_DEVELOPMENT_SEED=true in .env.local to execute dev seeding.");
    process.exit(1);
  }

  // 3. Environment Credentials Check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey || supabaseUrl.includes("placeholder") || secretKey.includes("placeholder")) {
    console.error("ERROR: Valid NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required to run seed script.");
    process.exit(1);
  }

  const adminSupabase = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false },
  });

  console.log("Connected to Supabase. Seeding test records safely...");

  // A. Seed Test Leads
  const testLeadData = [
    {
      full_name: "[SEED] Sarah Jenkins",
      phone: "(949) 555-0142",
      email: "seed.sarah@example.com",
      city: "Newport Beach",
      property_type: "Residential",
      service_requested: "Fountain Repair",
      message: "[SEED] Fountain pump motor making grinding noise.",
      preferred_contact_method: "phone",
      status: "new",
    },
    {
      full_name: "[SEED] Michael Chang",
      phone: "(714) 555-0198",
      email: "seed.michael@example.com",
      city: "Irvine",
      property_type: "Commercial",
      service_requested: "Commercial Water Features",
      message: "[SEED] Courtyard fountain monthly maintenance inquiry.",
      preferred_contact_method: "email",
      status: "contacted",
    },
  ];

  for (const lead of testLeadData) {
    const { data: existing } = await adminSupabase.from("leads").select("id").eq("email", lead.email).single();
    if (!existing) {
      const { data: insertedLead } = await adminSupabase.from("leads").insert(lead).select().single();
      if (insertedLead) {
        await adminSupabase.from("lead_activities").insert({
          lead_id: insertedLead.id,
          activity_type: "created",
          notes: "[SEED] Created initial test lead via seed script",
          new_status: lead.status,
        });
        console.log(`✓ Created test lead: ${lead.full_name}`);
      }
    } else {
      console.log(`- Test lead already exists: ${lead.full_name}`);
    }
  }

  // B. Seed Test Customer
  const testCustEmail = "seed.robert@example.com";
  let customerId: string | null = null;

  const { data: existingCust } = await adminSupabase.from("customers").select("id").eq("email", testCustEmail).single();

  if (!existingCust) {
    const { data: newCust, error: custErr } = await adminSupabase
      .from("customers")
      .insert({
        full_name: "[SEED] Robert Miller",
        phone: "(949) 555-0111",
        email: testCustEmail,
        city: "Laguna Beach",
        service_address: "123 Ocean View Dr, Laguna Beach, CA 92651",
        notes: "[SEED] Premium residential estate fountain client",
        customer_status: "active",
      })
      .select()
      .single();

    if (!custErr && newCust) {
      customerId = newCust.id;
      console.log(`✓ Created test customer: ${newCust.full_name}`);
    }
  } else {
    customerId = existingCust.id;
    console.log(`- Test customer already exists: ${testCustEmail}`);
  }

  // C. Seed Test Job
  if (customerId) {
    let jobId: string | null = null;
    const { data: existingJob } = await adminSupabase.from("jobs").select("id").eq("customer_id", customerId).single();

    if (!existingJob) {
      const { data: newJob, error: jobErr } = await adminSupabase
        .from("jobs")
        .insert({
          customer_id: customerId,
          service_type: "Tier 3 Architectural Fountain Restoration",
          description: "[SEED] Replaced main re-circulating pump and sealed lower basin waterproof lining.",
          estimate_amount: 1450.00,
          final_amount: 1450.00,
          scheduled_date: new Date(Date.now() - 7 * 86400000).toISOString(),
          completed_date: new Date(Date.now() - 2 * 86400000).toISOString(),
          job_status: "completed",
        })
        .select()
        .single();

      if (!jobErr && newJob) {
        jobId = newJob.id;
        console.log(`✓ Created completed test job: ${newJob.service_type}`);
      }
    } else {
      jobId = existingJob.id;
      console.log(`- Test job already exists for customer.`);
    }

    // D. Seed Test Review Request (Pending)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const { data: existingReq } = await adminSupabase.from("review_requests").select("id").eq("customer_id", customerId).single();

    if (!existingReq) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await adminSupabase.from("review_requests").insert({
        customer_id: customerId,
        job_id: jobId,
        token_hash: tokenHash,
        status: "sent",
        sent_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });
      console.log(`✓ Created test review request for customer`);
    } else {
      console.log(`- Test review request already exists.`);
    }

    // E. Seed Approved Testimonial
    const { data: existingTestimonial } = await adminSupabase.from("testimonials").select("id").eq("customer_id", customerId).single();

    if (!existingTestimonial) {
      await adminSupabase.from("testimonials").insert({
        customer_id: customerId,
        job_id: jobId,
        rating: 5,
        review_text: "[SEED] OC Water Features restored our multi-tier fountain flawlessly. Water runs crystal clear and quiet!",
        display_name: "Robert M.",
        city: "Laguna Beach",
        permission_to_publish: true,
        approved: true,
        approved_at: new Date().toISOString(),
      });
      console.log(`✓ Created approved test testimonial for public gallery`);
    } else {
      console.log(`- Test testimonial already exists.`);
    }
  }

  console.log("------------------------------------------------");
  console.log("Development seeding process complete!");
  console.log("------------------------------------------------");
}

runSeed().catch((err) => {
  console.error("Unhandled seed error:", err);
  process.exit(1);
});
