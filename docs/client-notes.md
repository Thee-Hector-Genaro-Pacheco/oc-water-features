# Client Onboarding Notes & Information Needed - OC Water Features

This document tracks items that require confirmation from the business owners before final launch.

## 1. Placeholder Information Confirmation Checklist

- [x] **Phone Number**: Confirmed — `(714) 362-4376`, set in `src/data/company.ts`.
- [x] **Email Address**: Confirmed — `ocwaterfeatures@live.com`, set in `src/data/company.ts`.
- [x] **Business Credentials**: Confirmed as of SEO Phase 0 (see `docs/seo-optimization-plan.md` for full detail). The business holds a City of Westminster business license (#05118130) and a CPO certification; there is **no** verified California CSLB contractor license on file, so the site must not claim "licensed contractor," "CSLB," or "C-27." Insurance has not been independently verified — do not claim "Insured" until documentation is supplied.
- [ ] **Business Hours**: Still not independently verified. Previously displayed "Monday – Saturday: 7:00 AM – 5:00 PM" on the Contact page; removed from public rendering during the pre-deploy safety cleanup until confirmed — do not reintroduce specific hours without owner sign-off. Also intentionally **not** included in the LocalBusiness structured data until verified.
- [ ] **Homepage Testimonials**: The four entries in `src/data/testimonials.ts` are unverified placeholder/demo content (fabricated names, quotes, and dates used to build out the Testimonials component). All are marked `published: false` and excluded from public rendering as of the pre-deploy safety cleanup; the homepage currently shows a "Customer Reviews Coming Soon" placeholder instead. Do not set any entry to `published: true` unless it is a real, verified customer review.
- [ ] **Form Integration Target**: Specify email notification recipient or CRM endpoint for estimate submission leads.
- [ ] **Insurance documentation**: If the business carries general liability insurance, provide documentation so "Insured" claims can be safely reintroduced to the site.
- [ ] **Google Business Profile / social profile URLs**: Needed to populate `sameAs` in structured data (currently omitted rather than left empty/fake).

## 2. Media & Asset Requests

- [ ] High-resolution project photos for major categories:
  - Tiered courtyard fountains
  - Residential & HOA koi ponds
  - Rock waterfalls
  - Commercial plaza water walls
- [ ] Before/After project pairs for the project gallery.
- [ ] High-resolution team/vehicle photos for the About page.

## 3. Project Gallery Verification Checklist (pre-deploy safety audit)

The entries in `src/data/projects.ts` are rendered publicly as completed jobs with
specific locations, completion years, and named commercial properties. Photos
were added as "real" project photography, but the following facts have **not**
been independently confirmed and need owner sign-off before launch. Nothing in
`src/data/projects.ts` was changed or fabricated during this audit — this is a
verification checklist only.

- [ ] **Bella Terra** (`bella-terra-commercial-fountain`, Huntington Beach, CA,
      completion year 2024): Confirm this is a real completed job, the
      completion year is accurate, and the business owner approves publicly
      naming "Bella Terra" as a client/location.
- [ ] **LA Fitness** (`la-fitness-entry-fountain`, Irvine, CA, completion year
      2024): Confirm this is a real completed job, the completion year is
      accurate, and the business owner approves publicly naming "LA Fitness"
      as a client/location.
- [ ] **The Point** (four entries: `plaza-fountain-the-point-1`,
      `plaza-fountain-the-point-2`, `plaza-fountain-the-point-3`,
      `plaza-fountain-the-point-4`; locations currently listed generically as
      "Orange County Region", completion years 2023–2024): Confirm the actual
      property name/location for each, whether "The Point" is the correct
      identity to publish, and whether the owner approves naming it.
- [ ] **All displayed completion years** (2023/2024 across every project
      entry): Confirm each date reflects when the work actually happened.
- [ ] **City/location claims**: Confirm the specific cities listed (Huntington
      Beach, Irvine, Newport Beach, Anaheim, Laguna Beach) are correct for
      each project, and decide whether the generic "Orange County Region"
      entries should be replaced with specific cities or left generic.
- [ ] **Scope-of-work descriptions**: Confirm the technical details in each
      project's `description` (e.g. "pressure line flush, manifold spray jet
      alignment," "replaced worn impeller, updated check valves") accurately
      reflect the work performed, not generic/templated copy.
- [ ] **Public naming approval**: For every commercial location/client named
      above, confirm the business owner has permission (or an existing
      client relationship that supports it) to publicly reference that
      business by name on the marketing site.

## 4. Confirmed Service Offerings Policy

The website strictly advertises water feature specialties:
- Fountain Maintenance & Repair
- Pond Cleaning & Ecosystem Care
- Pump Repair & Replacement
- Leak Detection & Basin Sealing
- Commercial Water Feature Maintenance
- Water Feature Restoration

*Note: In compliance with trade boundaries, roofing, electrical contracting, plumbing contracting, drywall, or concrete contracting outside license scopes are explicitly excluded.*
