# Admin Access Governance & Onboarding Guide

## Overview

Public sign-up for administrators is strictly prohibited. Initial administrator accounts must be created manually using Supabase Authentication and linked to `admin_profiles`.

## Manual Administrator Onboarding

1. Log into your **Supabase Dashboard** > **Authentication** > **Users**.
2. Click **Add User** > **Create User** with the administrator's email and initial password.
3. Copy the generated User `UUID`.
4. Open the **SQL Editor** and insert the matching `admin_profiles` record:

```sql
INSERT INTO public.admin_profiles (user_id, full_name, role, is_active)
VALUES ('<USER-UUID-HERE>', 'Administrator Full Name', 'admin', TRUE);
```

For the primary business owner, set `role = 'owner'`. Only owner profiles may manage administrator access.
