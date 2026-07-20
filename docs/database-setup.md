# Database Setup & Migrations Guide - Supabase PostgreSQL

This document outlines the step-by-step procedure to execute the SQL migrations on your Supabase project.

## SQL Migration Execution Sequence

Execute the SQL migration scripts in order inside the **Supabase SQL Editor**:

### 1. Initial Schema (`supabase/migrations/001_initial_schema.sql`)
Creates the 7 database tables with UUID primary keys and `timestamptz` timestamp columns:
- `admin_profiles`
- `leads`
- `lead_activities`
- `customers`
- `jobs` (numeric currency fields for `estimate_amount` and `final_amount`)
- `review_requests` (secure `token_hash`)
- `testimonials`

### 2. Row Level Security (`supabase/migrations/002_rls_policies.sql`)
Enables RLS on all tables and creates policies:
- Blocks public read/write access to business data tables.
- Restricts public access to approved testimonials with `permission_to_publish = true`.
- Defines `is_active_admin()` and `is_active_owner()` helper functions for authenticated access controls.

### 3. Indexes & Triggers (`supabase/migrations/003_indexes_and_triggers.sql`)
Creates database performance indexes and attaches automated `set_updated_at()` triggers.
