# OC Water Features - Full-Stack Production Application

Professional, dynamic full-stack web application for **OC Water Features**, a family-operated Southern California water-feature maintenance and repair company with industry experience dating back to 1992.

---

## Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Dynamic SSR)
- **Database**: Supabase PostgreSQL (7 Tables with UUID primary keys & RLS)
- **Authentication**: Supabase Auth SSR with Server-Side authorization guards
- **Validation**: Zod schema validation
- **Styling**: Tailwind CSS
- **Hosting Target**: Vercel (Dynamic Next.js App Router Hosting) — see `docs/vercel-deployment.md`

---

## Phase 2 Features Included

1. **Public Lead Intake API (`/api/leads`)**:
   - Zod input validation
   - Bot protection honeypot
   - Marketing & SEO attribution tracking (UTM parameters, referrer, landing page)
   - Fallback mode for local development when database credentials are not configured
2. **Protected Administrator Portal (`/admin`)**:
   - Server-side auth & active profile checks (`requireAdmin()`, `requireOwner()`)
   - Real-time conversion metrics dashboard
   - Lead management, status updates, assignment, activity history audit
   - Won lead to Customer conversion tool
   - Customer directory & Job contract pipeline
3. **Secure Customer Review System**:
   - Cryptographically random review token generator with SHA-256 hash storage
   - Public customer review submission page (`/review/[token]`)
   - Direct link to Google Reviews (`GOOGLE_REVIEW_URL`) without gating
   - Admin testimonial review & approval system

---

## Local Setup & Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env.local
cp .env.example .env.local

# 3. Start local development server
npm run dev

# 4. Run code checks
npm run lint

# 5. Build production application
npm run build
```
