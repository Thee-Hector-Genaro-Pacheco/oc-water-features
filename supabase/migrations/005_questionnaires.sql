-- 005_questionnaires.sql
--
-- Second-stage customer intake questionnaire, sent automatically after a
-- lead is created (and resendable by an admin). One questionnaire per lead
-- for v1.0: lead_id is UNIQUE to prevent duplicate rows. Only the lifecycle
-- `status` column is CHECK-constrained — the customer-facing answer fields
-- below are plain TEXT/TEXT[] validated at the Zod layer
-- (src/schemas/questionnaire.ts) so a future wording change to a label
-- never requires a database migration, matching this repo's existing
-- convention (see leads.property_type / leads.preferred_contact_method,
-- which are also unconstrained TEXT columns validated in src/schemas/lead.ts).

CREATE TABLE IF NOT EXISTS public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,

  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'sent', 'opened', 'submitted', 'expired', 'revoked')
  ),

  -- Customer-facing answers (all nullable until submitted)
  service_requested TEXT[],
  service_requested_other_detail TEXT,
  property_type TEXT,
  water_feature_age TEXT,
  issue_duration TEXT,
  operating_condition TEXT,
  leak_condition TEXT,
  previous_service_status TEXT,
  previous_service_explanation TEXT,
  maintenance_frequency TEXT,
  preferred_contact_method TEXT,
  preferred_contact_time TEXT,
  additional_notes TEXT,

  -- Workflow timestamps. sent_at/opened_at/submitted_at only ever get
  -- populated by application code after the corresponding event is
  -- actually confirmed (e.g. sent_at is only set when the invite email's
  -- deliveryMode === "sent", never on a dev-logger fallback or a failed
  -- send) — see src/lib/email/sendQuestionnaireInvite.ts.
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,

  created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES (mirrors 003_indexes_and_triggers.sql's pattern for review_requests)
CREATE INDEX IF NOT EXISTS idx_questionnaires_token_hash ON public.questionnaires(token_hash);
CREATE INDEX IF NOT EXISTS idx_questionnaires_lead_id ON public.questionnaires(lead_id);
CREATE INDEX IF NOT EXISTS idx_questionnaires_status ON public.questionnaires(status);

-- ROW LEVEL SECURITY (mirrors 002_rls_policies.sql's pattern for review_requests)
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active admins can perform all operations on questionnaires"
  ON public.questionnaires FOR ALL
  USING (is_active_admin());

-- GRANTS (mirrors 004_grant_table_privileges.sql — required before RLS is
-- ever evaluated, or every query fails with SQLSTATE 42501 regardless of
-- policy correctness)
GRANT ALL ON public.questionnaires TO authenticated, service_role;
