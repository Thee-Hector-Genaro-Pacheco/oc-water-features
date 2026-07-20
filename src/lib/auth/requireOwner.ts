import { redirect } from "next/navigation";
import { requireAdmin, AdminProfile } from "./requireAdmin";

export async function requireOwner(): Promise<{ user: { id: string; email?: string }; profile: AdminProfile }> {
  const { user, profile } = await requireAdmin();

  if (profile.role !== "owner") {
    redirect("/admin?error=owner_required");
  }

  return { user, profile };
}
