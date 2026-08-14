-- 004_grant_table_privileges.sql
--
-- ROOT CAUSE FIX: PostgreSQL requires a role to hold a base table-level
-- GRANT before Row Level Security policies are ever evaluated. Migrations
-- 001-003 created the tables and RLS policies but never issued any GRANT
-- statements, and this project's Postgres role defaults did not pre-supply
-- them. The result: every query — including from `service_role` — failed
-- with "permission denied for table ..." (SQLSTATE 42501) *before* RLS had
-- a chance to run, which is what produced the "Access Denied: Your account
-- does not have an active administrator profile" message after a
-- successful login (requireAdmin()'s admin_profiles SELECT was being
-- rejected at the grant level, not filtered to zero rows by RLS).
--
-- This migration only restores the baseline command-level permissions RLS
-- was already designed to filter within. It does not add, remove, or
-- change any RLS policy, and does not grant anything to `anon` beyond what
-- the existing "Public can view approved published testimonials" policy
-- (002_rls_policies.sql) already intends to allow.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- service_role already bypasses RLS via its role attribute, but it still
-- needs the base table grant to be allowed to issue the SQL command at
-- all — this is what the secret-key admin client uses.
GRANT ALL ON public.admin_profiles TO authenticated, service_role;
GRANT ALL ON public.leads TO authenticated, service_role;
GRANT ALL ON public.lead_activities TO authenticated, service_role;
GRANT ALL ON public.customers TO authenticated, service_role;
GRANT ALL ON public.jobs TO authenticated, service_role;
GRANT ALL ON public.review_requests TO authenticated, service_role;
GRANT ALL ON public.testimonials TO authenticated, service_role;

-- Matches the existing public-testimonials RLS policy's intent — anon
-- needs the base SELECT grant for that policy to ever be reachable.
GRANT SELECT ON public.testimonials TO anon;
