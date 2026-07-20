# Local End-to-End Testing Checklist

Use this manual verification checklist to validate the public website, estimate intake, admin authentication, lead conversion, job pipeline, and customer review submission flow.

---

## 1. Public Marketing Website
- [ ] **Public Homepage (`/`)**: Verify hero section, services showcase, project gallery preview, and trust badges render properly.
- [ ] **Mobile Navigation**: Open mobile browser drawer, test menu links (Services, Projects, Service Areas, Request Estimate, Contact).
- [ ] **Services Directory (`/services`) & Detail Pages**: Confirm 6 service detail pages load clean without broken layout.

---

## 2. Estimate Form Intake & Bot Protection
- [ ] **Estimate Form Success (`/request-estimate`)**: Submit valid details. Confirm thank-you message displays with submission ID.
- [ ] **Validation Failure**: Attempt to submit missing required fields or malformed email (`invalid-email`). Confirm red inline error alerts display.
- [ ] **Spam Honeypot Check**: Inspect element and populate hidden input `website_hp`. Submit form; verify silent rejection returning success response without creating DB lead.
- [ ] **Database Intake**: Verify lead appears in Supabase `leads` table with correct `status = 'new'` and marketing attribution (`utm_*`, referrer).

---

## 3. Admin Authentication & Access Controls
- [ ] **Unauthorized Admin Redirect**: Attempt accessing `/admin` while signed out. Confirm server redirects to `/admin/login`.
- [ ] **Authorized Owner Login**: Enter valid credentials on `/admin/login`. Confirm successful authentication and landing on `/admin` metrics dashboard.
- [ ] **Diagnostics Health Check (`/admin/settings/diagnostics`)**: Verify database reachability, authenticated user email, role, and configuration presence.

---

## 4. Lead Management & Client Conversion
- [ ] **Lead Status Update (`/admin/leads/[id]`)**: Change status from `new` to `contacted` and `estimate_scheduled`. Confirm audit activity entry is appended to timeline.
- [ ] **Lead Conversion**: Click **Convert Won Lead to Customer**. Confirm lead status transitions to `won` and redirects to `/admin/customers/[id]`.
- [ ] **Customer Creation**: Verify new record appears in `/admin/customers` directory with original lead context.

---

## 5. Job Contracts & Pipeline
- [ ] **Job Creation**: On customer detail page, click **Create New Job Contract**. Fill service type, estimate amount, final amount, and scheduled date. Save contract.
- [ ] **Job Completion**: Mark job as `completed`. Confirm status updates and completion date populates in job pipeline.

---

## 6. Secure Review Tokens & Testimonials
- [ ] **Review Request Generation (`/admin/reviews`)**: Select customer and generate request link. Confirm SHA-256 hash is saved in DB and raw link is generated.
- [ ] **Review Link Tracking**: Open generated `/review/[token]` link in an incognito window. Verify `/api/reviews/[token]/open` updates status to `opened`.
- [ ] **Review Form Submission**: Complete 5-star rating, feedback, display name, city, and check permission to publish. Submit form.
- [ ] **Ungated Google Review Option**: Confirm thank-you screen displays direct button linking to `GOOGLE_REVIEW_URL`.
- [ ] **Testimonial Approval**: In `/admin/reviews`, locate submitted feedback and click **Approve for Public Website**.
- [ ] **Public Testimonial Display**: Visit homepage `/` testimonials section; confirm approved review appears.

---

## 7. Sign Out & Revocation Verification
- [ ] **Sign Out**: Click **Sign Out** in admin sidebar. Confirm session cookie is cleared and user is redirected to login page.
- [ ] **Revoked Admin Access**: Mark `is_active = FALSE` on an admin profile in Supabase. Attempt logging in with that user; confirm `access_denied` error screen displays.
