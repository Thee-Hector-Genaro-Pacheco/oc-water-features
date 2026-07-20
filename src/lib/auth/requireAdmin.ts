import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: "owner" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function requireAdmin(): Promise<{ user: { id: string; email?: string }; profile: AdminProfile }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (profileError || !profile) {
    redirect("/admin/login?error=access_denied");
  }

  return { user: { id: user.id, email: user.email }, profile: profile as AdminProfile };
}
