# Supabase Project Bootstrap & Operations Guide

This document provides exact manual procedures for initializing, configuring, and maintaining your Supabase PostgreSQL project for **OC Water Features**.

---

## 1. Creating the Supabase Project

1. Log in to [Supabase Console](https://supabase.com/dashboard).
2. Click **New Project** and select your Organization.
3. Set Project Name: `oc-water-features`.
4. Database Password: Generate a strong, high-entropy database password and store it in your password vault.
5. Region: Select **US West (N. California - us-west-1)**.
6. Pricing Plan: Select Free or Pro Tier.
7. Click **Create New Project** and allow ~2 minutes for provision completion.

---

## 2. Locating API Keys & URLs

1. In your Supabase Dashboard, navigate to **Project Settings** > **API**.
2. **Project URL**: Copy `https://<your-project-ref>.supabase.co`.
3. **Anon Key (Public)**: Copy `anon` `public` key string.
4. **Service Role Key (Secret)**: Copy `service_role` `secret` key string.

---

## 3. Adding Values to `.env.local`

Create or update `.env.local` in your project root:

```bash
# Supabase Production Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...<your-service-role-key>

# Application URL & Settings
NEXT_PUBLIC_SITE_URL=https://ocwaterfeatures.com
BUSINESS_NOTIFICATION_EMAIL=info@ocwaterfeatures.com
ADMIN_NOTIFICATION_EMAIL=admin@ocwaterfeatures.com
GOOGLE_REVIEW_URL=https://g.page/r/your-google-place-id/review

# Development Controls
ALLOW_DEVELOPMENT_SEED=false
```

---

## 4. Running Migration Files in Order

Open the **Supabase SQL Editor** and execute the migration files located in `supabase/migrations/` sequentially:

1. Copy and run contents of `001_initial_schema.sql` (Creates 7 tables with UUID primary keys and numeric currency fields).
2. Copy and run contents of `002_rls_policies.sql` (Enforces Row Level Security on all 7 tables and creates RLS helper functions).
3. Copy and run contents of `003_indexes_and_triggers.sql` (Adds performance indexes and `updated_at` auto-update triggers).

---

## 5. Creating the Primary Owner Account

1. Navigate to **Authentication** > **Users** in Supabase Dashboard.
2. Click **Add User** > **Create User**.
3. Enter Owner Email (e.g. `owner@ocwaterfeatures.com`) and secure initial password.
4. Copy the generated User **UUID** (e.g. `00000000-0000-0000-0000-000000000001`).
5. Open **SQL Editor** and insert the owner profile:

```sql
INSERT INTO public.admin_profiles (user_id, full_name, role, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Primary Business Owner', 'owner', TRUE);
```

---

## 6. Provisioning Additional Administrators

1. Go to **Authentication** > **Users** > **Create User**.
2. Enter Staff Administrator email and password.
3. Copy the staff User **UUID** (e.g. `00000000-0000-0000-0000-000000000002`).
4. Execute SQL to provision an `admin` role profile:

```sql
INSERT INTO public.admin_profiles (user_id, full_name, role, is_active)
VALUES ('00000000-0000-0000-0000-000000000002', 'Technician Staff Admin', 'admin', TRUE);
```

---

## 7. Revoking an Administrator Access

To immediately revoke access without deleting historic audit logs:

```sql
UPDATE public.admin_profiles
SET is_active = FALSE, updated_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000002';
```

Server authorization guards (`requireAdmin()`) check `is_active = true` on every request and will deny portal access immediately.

---

## 8. Key Rotation Security Protocol

If `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accidentally exposed:

1. Navigate to **Project Settings** > **API**.
2. Click **JWT Secret** > **Generate new secret**.
3. Re-generate Anon and Service-Role keys.
4. Immediately update environment variables in your local `.env.local` and host settings (AWS Amplify).
5. Redeploy application.
