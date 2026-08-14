# Application Security & Authorization Model

## Row Level Security (RLS) & Data Protection

- All 7 database tables enforce Row Level Security.
- Public browser code cannot execute direct SQL queries against business tables.
- Route Handlers validate input via Zod schemas before interacting with Supabase.
- `SUPABASE_SECRET_KEY` is strictly confined to server-side code (`src/lib/supabase/admin.ts`). It is never bundled into client JS.

## Server-Side Authorization Guards

All `/admin` routes are protected on the server using `requireAdmin()` and `requireOwner()` helpers in `src/lib/auth/`:
1. Verify Supabase session validity.
2. Query `admin_profiles` to confirm user is active (`is_active = true`).
3. Redirect unauthenticated users to `/admin/login`.
4. Redirect non-admin/inactive users to access denied page.
