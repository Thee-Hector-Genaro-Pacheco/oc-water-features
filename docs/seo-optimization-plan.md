# SEO Optimization Plan — OC Water Features

Prepared from a full repo audit (Next.js 15 App Router, static export, Tailwind, Supabase backend). This plan replaces the skeletal `docs/seo-plan.md` with a prioritized, actionable roadmap. Items are ordered by impact-to-effort ratio within each phase.

## Current state summary

The foundation is better than average for a small-business site: per-page `Metadata` via `constructMetadata()`, canonical tags, Open Graph/Twitter cards, auto-generated `sitemap.xml` and `robots.txt`, a `LocalBusiness` JSON-LD block sitewide, semantic landmarks, and real testimonials/project data. The gaps are concentrated in five areas: incomplete structured data, no city-level landing pages despite city-level keyword targets, unfinished NAP (name/address/phone) data, no analytics/Search Console wiring, and content depth that's thin for competitive local terms.

---

## Phase 0 — Fix before doing anything else (blocking issues) — ✅ COMPLETED

Implemented. Original scope and outcome below; full detail (files touched, verified credentials, manual follow-up) is in **"Phase 0 Implementation Report"** further down this document.

1. **Close the admin/token surface to crawlers.** ✅ Done. `robots.ts` now disallows `/admin/`, `/api/`, and `/review/`; `src/app/admin/layout.tsx` and a new `src/app/review/layout.tsx` set `robots: { index: false, follow: false }` in metadata (the definitive protection — robots.txt alone doesn't guarantee exclusion from the index).
2. **Resolve the geographic identity conflict.** ✅ Done, per business-owner direction: the verified service area is **Orange County AND Los Angeles County** (not Orange County only). `company.ts`, `serviceAreas.ts`, and the `LocalBusiness` schema's `areaServed` now agree.
3. **Fill NAP placeholders.** ✅ Partially done — phone and email were already correct and are now the single source of truth in `company.ts`. License/insurance claims were corrected to match verified credentials (see below) rather than invented. A real street address is intentionally **not** added — see Privacy note below.
4. **Install analytics and verify Search Console.** ✅ Done. A production-safe GA4 integration (env-gated, no-ops when unconfigured) now loads in `layout.tsx`, and `constructMetadata()` supports Search Console HTML-tag verification via an env var. Actual GA4 property creation and Search Console verification are manual steps for Hector (see below) — nothing is claimed as "connected" until he does this.

## Phase 1 — Structured data expansion

The site has one JSON-LD block (`LocalBusiness`, sitewide, in `layout.tsx`). For a home-services business this is underusing schema:

- **`Service` schema** on each of the 6 service pages (`src/app/services/*/page.tsx`), referencing the parent `LocalBusiness` via `@id` and using `areaServed` from the corrected service-area list.
- **`FAQPage` schema** — `src/data/faqs.ts` already has 6 well-formed Q&As not currently rendered as an FAQ block anywhere or marked up as schema. Add a visible FAQ section (home page and/or a dedicated `/faq` page) with `FAQPage` JSON-LD — this is a direct path to FAQ rich results.
- **`Review` / `AggregateRating`** — `src/data/testimonials.ts` has 4 real 5-star reviews with dates. Surface `AggregateRating` on the `LocalBusiness` schema and individual `Review` nodes. This is meaningful because the codebase already has a review-collection pipeline (`src/app/api/admin/reviews/generate`, `src/app/review/[token]`) — once real customer reviews accumulate, this schema should pull from live data rather than the static array.
- **`BreadcrumbList`** — service detail pages already render a visual breadcrumb (`Services / Fountain Repair`); add matching JSON-LD.
- **`ImageObject`/`Project` (as `CreativeWork` or via `Service` `workExample`)** for the project gallery, once real photography is in place (see Phase 2).

## Phase 2 — Close the content and city-page gap

`docs/seo-plan.md` explicitly targets keywords like "fountain maintenance Newport Beach" and "koi pond cleaning Irvine," but the site has no page that could rank for a city+service query — only one consolidated `/service-areas` page listing 15 cities in a grid, and 6 generic (non-geo) service pages. This is the single biggest ranking gap:

1. **Build service × city landing pages** for the top 4–5 cities (Irvine, Newport Beach, Huntington Beach, Laguna Beach, Anaheim) × top 2–3 services (fountain repair, fountain maintenance, pond cleaning) — a small, high-intent set (10–15 pages), not all 15 cities × 6 services (that volume risks thin/duplicate content penalties). Each page needs genuinely unique copy (neighborhood references, service specifics), not templated find-and-replace text.
2. **Replace placeholder visuals with real photography.** `docs/website-audit.md` confirms "Stylized CSS gradient visual containers for non-existent image placeholders" are still in use in several spots, and `docs/client-notes.md` is still waiting on real before/after project photos. Image search and local pack results both reward real, geotagged, well-captioned project photography — this also directly supports the `imageAlt` fields already scaffolded in `src/data/projects.ts`.
3. **Add a resource/blog section** for informational queries ("how to fix a cloudy fountain," "koi pond winterizing checklist," etc.) that funnel into service pages. Even 6–8 solid articles materially expand the keyword footprint and give something to link back to from local citations and GBP posts.
4. **Expand thin pages.** `/contact` and `/request-estimate` should be checked for substantive body copy (not just a form) — forms alone don't give Google much to index.

## Phase 3 — Technical/on-page polish

- **Image optimization strategy.** `next.config.ts` sets `images: { unoptimized: true }` (required for static export). Since Next's built-in optimizer isn't available at request time, pre-optimize source images (WebP/AVIF, correctly sized, compressed) before they land in `public/images/`, since there's no runtime fallback doing it for you.
- **Metadata audit pass.** Spot-checked pages (`/`, `/about`, `/services/fountain-repair`, `/service-areas`) all use `constructMetadata()` correctly with unique titles/descriptions — confirm the remaining pages (`/projects`, `/contact`, `/request-estimate`, and the other 5 service pages) do the same and that no title exceeds ~60 characters or description ~155 characters.
- **`sameAs` in schema.** As of Phase 0, `generateLocalBusinessSchema()` omits `sameAs` entirely (an empty array added no value and risked looking incomplete to validators). Add it back with the real Google Business Profile, Facebook, Yelp, and Nextdoor URLs once available — this is a meaningful entity-verification signal for local SEO.
- **`AggregateRating`/`Review` and `openingHoursSpecification`** were also intentionally left out of the Phase 0 schema rewrite (unverified data — see Phase 0 report). Add `AggregateRating`/`Review` once there's a live review data source to back it (Phase 1 item above), and add `openingHoursSpecification` once business hours are independently confirmed.
- **Internal linking.** Footer and nav already link services/about/areas well; once city-service pages exist (Phase 2), cross-link them from the relevant service page, the `/service-areas` city cards, and the homepage.
- **Core Web Vitals check.** Run Lighthouse/PageSpeed Insights post-deploy once real images are in place — `next/font` with `display: swap` is already handled correctly for the Inter font, which is good.

## Phase 4 — Off-page / local signals (owner-dependent, not code changes)

- Claim/optimize Google Business Profile with matching NAP, categories (fountain contractor, pond contractor), service area, and the same real photos used on-site.
- Build citations on Yelp, Angi, Nextdoor, BBB, and industry directories (pool/pond/landscape associations) with identical NAP.
- Use the existing review-request token system (`src/lib/reviews/tokens.ts`, `sendReviewRequest.ts`) to actively drive Google reviews post-job — review velocity and recency are strong local ranking factors.
- Pursue a few local backlinks: HOA/property-management partners, supplier/manufacturer "find a dealer" pages, local chamber of commerce.

---

## Suggested sequencing

Phase 0 is config/data changes only (roughly a day of work). Phase 1 is schema/component work using data that already exists in the repo. Phase 2 is the highest-effort, highest-payoff phase and depends on the client for photography and city-page copy approval. Phase 3 can run in parallel with Phase 2. Phase 4 is ongoing and owner-driven rather than a one-time build.

## Open questions for the client

- ~~True service area~~ **Resolved**: Orange County + Los Angeles County (see Phase 0 report).
- CSLB contractor license number (if/when the business obtains one) — until then, no contractor-license claims should appear on the site.
- General liability / business insurance documentation, if the business carries it, so "Insured" claims can be safely reintroduced.
- Availability of real project photography and Google Business Profile / social profile URLs (needed for Phase 2 and the `sameAs` schema field).
- Confirmation of posted business hours (currently shown on `/contact` but not independently verified — see `docs/client-notes.md`).

---

## Phase 0 Implementation Report

**Status:** Complete. **Scope:** technical SEO foundation, business-information accuracy, crawler protection, and analytics readiness only — no city landing pages, blog content, or design changes were made (that's Phase 2+, out of scope for this pass).

### 1. Crawler / indexing protection

- `src/app/robots.ts` — added `disallow: ["/admin/", "/api/", "/review/"]`. Sitemap URL now derives from `NEXT_PUBLIC_SITE_URL`.
- `src/app/admin/layout.tsx` — added `export const metadata` with `robots: { index: false, follow: false }`. Applies to every page under `/admin/*` (dashboard, leads, customers, jobs, reviews, settings, login) since none of those pages define their own conflicting metadata.
- `src/app/review/layout.tsx` — **new file**. `/review/[token]/page.tsx` is a client component and can't export `metadata` directly, so this parent layout supplies `robots: { index: false, follow: false }` for the whole `/review/*` segment. These URLs contain single-use tokens and should never be indexed.
- `src/app/sitemap.ts` — audited: contains only the 7 static marketing routes plus the 6 service-detail routes. No admin/api/review/auth URLs were ever present here; added a code comment documenting that constraint so it stays true going forward. Base URL now derives from `NEXT_PUBLIC_SITE_URL`.

### 2. Business-information consistency (single source of truth)

`src/data/company.ts` is now the canonical source for name, phone, email, service area, experience/history phrasing, and credentials phrasing. Every page/component that previously hardcoded these strings (`Footer.tsx`, `Navbar.tsx`, `Hero.tsx`, `AboutPreview.tsx`, `about/page.tsx`, `contact/page.tsx`, `request-estimate/page.tsx`, `services/page.tsx`, `service-areas/page.tsx`, `services.ts`, `faqs.ts`, `utils.ts`, `metadata.ts`) was updated to reference it instead.

Corrections made:

- **History/experience claims**: removed all "serving since 1995" / "30 years since 1995" copy that implied the *company* was founded in 1995. Replaced with verified, conservative wording: **"Industry Experience Since 1992"** (describing technician/owner experience, not a company founding date) and **"Serving Orange & Los Angeles Counties."**
- **Service area**: standardized to "Orange County and Los Angeles County, California" everywhere (`company.ts`, `serviceAreas.ts`, schema `areaServed`). `serviceAreas.ts` previously listed only Orange County cities despite `company.ts` claiming LA County too — added Pasadena, Beverly Hills, and Long Beach as Los Angeles County entries so the public `/service-areas` page reflects both counties.
- **Phone**: `(714) 362-4376` confirmed correct everywhere it appears (already accurate before this pass).
- **Email**: `ocwaterfeatures@live.com` confirmed correct everywhere it appears (already accurate before this pass).

### 3. Credential corrections

- Removed every "Licensed" / "Licensed & Insured" / "Licensed, Insured & CPO Certified" claim from the public site (`Hero.tsx`, `Navbar.tsx`, `about/page.tsx`, `services/fountain-repair/page.tsx`, `Footer.tsx`, `contact/page.tsx`). None of these were backed by a verified CSLB contractor license, and insurance has not been independently verified.
- Kept and centralized the verified **"CPO Certified"** claim (`companyData.credentialsTagline`).
- `src/data/company.ts` now carries a code comment documenting the verified credentials on file, for future editors:
  - City of Westminster Business License Tax Certificate — Business: O C WATERFEATURES, License #05118130, "Maintenance and Repair for Water Features," effective 10/1/2025–9/30/2026. **This is a city business license/tax certificate, not a CSLB contractor license** — the site must not describe the company as "licensed contractor," "CSLB licensed," or "C-27" on the strength of this document alone.
  - County of Los Angeles Dept. of Public Health, Swimming Pool Service Technician credential (holder: Antonio Pacheco), #PR0173735, expires 6/30/2027 — a technician credential, not a contractor license.
  - CPO (Certified Pool & Spa Operator) certification — confirmed by the business owner; no certification number was provided or invented.
  - Insurance status — **not independently verified**; no "Insured" claim appears anywhere on the site.
- These credential numbers/details are recorded here and in `company.ts` code comments (not residential-address information), but are **not yet displayed on public pages** — that's a Phase 1+ marketing decision for Hector to make, not something this pass should push live without sign-off.

### 4. Privacy

No street address appears anywhere in the codebase after this pass — not in page content, not in the `LocalBusiness` JSON-LD, not in metadata, not in any API response. The business is modeled as a **service-area business**: `generateLocalBusinessSchema()` in `src/lib/utils.ts` intentionally omits `address` and `geo` rather than fabricating a locality, and relies on `areaServed` (Orange County + Los Angeles County) instead. This is deliberate, not an oversight — see the code comment at the top of `generateLocalBusinessSchema()`.

### 5. Structured data (`generateLocalBusinessSchema()` in `src/lib/utils.ts`)

Rewritten to only assert verified information:

- **Removed** (previously present but unverified/invented): `priceRange`, `address` (was `addressLocality: "Orange County"` — inaccurate given the two-county service area and not backed by a real address), `geo` (was a non-standard `GeoShape`/`region` value that isn't valid schema anyway), `openingHoursSpecification` (unverified hours), `sameAs: []` (empty/unpopulated).
- **Kept/corrected**: `name`, `telephone`, `email` (all now sourced from `companyData`), `description` (rewritten to drop the 1995/licensed claims), `@id`/`url`/`image` (now built from `NEXT_PUBLIC_SITE_URL` instead of a hardcoded domain).
- **Fixed**: `areaServed` now lists `Orange County, CA` and `Los Angeles County, CA` as `AdministrativeArea` entries, replacing the old single-county + vague "Southern California" pairing.

### 6. Analytics implementation

New, production-safe, env-gated analytics layer:

- `src/lib/analytics/gtag.ts` — **new**. Core `trackEvent()` helper. Reads `NEXT_PUBLIC_GA_MEASUREMENT_ID`; every function no-ops safely (and never throws) when it's unset.
- `src/lib/analytics/events.ts` — **new**. Named event helpers: `trackPhoneCallClick`, `trackEmailClick`, `trackEstimateFormStart`, `trackEstimateFormSubmit`.
- `src/lib/analytics/trackCall.ts` — kept as a backward-compatible re-export of `trackPhoneCallClick` from `events.ts` (nothing else imported it).
- `src/components/analytics/GoogleAnalytics.tsx` — **new**. Loads gtag.js via `next/script` and initializes GA4 **only** when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set; renders nothing otherwise. Mounted in `src/app/layout.tsx`.
- `src/components/ui/EmailLink.tsx` — **new** (mirrors the existing `PhoneCallLink.tsx`). Wraps every public `mailto:` link (`Footer.tsx`, `contact/page.tsx`, `request-estimate/page.tsx`) so `email_click` fires consistently.
- `request-estimate/page.tsx` — added `estimate_form_start` (fires once, on first field focus) and `estimate_form_submit` (fires on confirmed successful submission, with service/property type).
- Previously, `trackPhoneCallClick` pushed to `window.dataLayer`, but **no GTM/GA snippet was ever loaded** — those events went nowhere. That gap is now closed.

### 7. Search Console readiness

- `src/lib/metadata.ts` — `constructMetadata()` now emits a `verification: { google: ... }` meta tag **only** when the `GOOGLE_SITE_VERIFICATION` env var is set. No placeholder/fake token is shipped.
- `src/lib/env.ts` — documented `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `GOOGLE_SITE_VERIFICATION` in the env schemas for discoverability.
- **Search Console is NOT connected** — that requires manual action (below). Nothing in this codebase claims otherwise.

### 8. Sitemap

`src/app/sitemap.ts` audited and confirmed to contain only public marketing URLs (home, about, services index + 6 service detail pages, projects, service-areas, request-estimate, contact). No admin/api/review/auth routes were ever included; a comment now documents that constraint. Base URL now derives from `NEXT_PUBLIC_SITE_URL` for correct production-domain generation.

### 9. Repo hygiene finding (outside the original checklist, flagged because it touches "never commit secrets")

`.gitignore` previously contained only `node_modules` — `.env.local` and the entire `.next/` build output directory were being tracked by git. `.env.local` currently only holds placeholder values (no live secrets were exposed by this), but the gap meant a future real credential saved to `.env.local` would get committed. Added `.env`, `.env.local`, `.env.*.local`, `.next/`, and `out/` to `.gitignore`. **This does not retroactively remove `.env.local`/`.next/` from git history** — see "What Hector needs to do" below.

### What still requires manual setup (Hector)

1. **Create a GA4 property** in Google Analytics, get the Measurement ID (`G-XXXXXXXXXX`), and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the production environment (e.g. Amplify environment variables). Analytics stays off until this is set.
2. **Google Search Console**: add the property (domain or URL-prefix), verify it (HTML-tag method: put the value Search Console gives you into `GOOGLE_SITE_VERIFICATION`; or use the DNS method instead if preferred — either works, only the HTML-tag method is wired into this codebase), submit `sitemap.xml`, and periodically use URL Inspection / Request Indexing for key pages once live.
3. **Set `NEXT_PUBLIC_SITE_URL`** to the real production domain in the hosting environment (Amplify) — canonical URLs, Open Graph URLs, and the generated sitemap/robots all depend on it.
4. **Decide whether/how to publish the verified credentials** (Westminster business license #, CPO certification, LA County pool tech credential) on the About/Contact pages. They're documented here and in `company.ts` but intentionally not pushed to public copy without your sign-off.
5. **Supply insurance documentation** if the business carries general liability insurance, so an "Insured" claim can be reintroduced accurately.
6. **Confirm business hours** currently shown on `/contact` ("Monday – Saturday: 7:00 AM – 5:00 PM").
7. **Untrack `.env.local` and `.next/` from git**: run `git rm -r --cached .env.local .next` locally, commit that removal, and if `.env.local` ever held real (non-placeholder) secrets, rotate them — the `.gitignore` fix alone doesn't erase git history.
8. **Google Business Profile / social URLs**, once available, to populate `sameAs` in structured data.
