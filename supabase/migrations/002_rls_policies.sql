-- 002_rls_policies.sql
-- Enable Row Level Security on all 7 tables

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Helper SQL Function: check if current auth user is an active admin profile
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = TRUE
  );
$$;

-- Helper SQL Function: check if current auth user is an active owner profile
CREATE OR REPLACE FUNCTION public.is_active_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
      AND is_active = TRUE
  );
$$;

-- 1. ADMIN PROFILES POLICIES
CREATE POLICY "Admins can view all admin profiles"
  ON public.admin_profiles FOR SELECT
  USING (is_active_admin());

CREATE POLICY "Only active owners can insert or update admin profiles"
  ON public.admin_profiles FOR ALL
  USING (is_active_owner());

-- 2. LEADS POLICIES
CREATE POLICY "Active admins can perform all operations on leads"
  ON public.leads FOR ALL
  USING (is_active_admin());

-- 3. LEAD ACTIVITIES POLICIES
CREATE POLICY "Active admins can perform all operations on lead activities"
  ON public.lead_activities FOR ALL
  USING (is_active_admin());

-- 4. CUSTOMERS POLICIES
CREATE POLICY "Active admins can perform all operations on customers"
  ON public.customers FOR ALL
  USING (is_active_admin());

-- 5. JOBS POLICIES
CREATE POLICY "Active admins can perform all operations on jobs"
  ON public.jobs FOR ALL
  USING (is_active_admin());

-- 6. REVIEW REQUESTS POLICIES
CREATE POLICY "Active admins can perform all operations on review requests"
  ON public.review_requests FOR ALL
  USING (is_active_admin());

-- 7. TESTIMONIALS POLICIES
-- Public read policy: Anyone can read approved testimonials with permission to publish
CREATE POLICY "Public can view approved published testimonials"
  ON public.testimonials FOR SELECT
  USING (approved = TRUE AND permission_to_publish = TRUE);

-- Admin policy: Active admins have full access to testimonials
CREATE POLICY "Active admins can perform all operations on testimonials"
  ON public.testimonials FOR ALL
  USING (is_active_admin());
