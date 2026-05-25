import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isSupabaseSchemaError } from "@/lib/supabase/errors";

export type AdminSession = {
  user: { id: string; email?: string };
  admin: { id: string; email: string; full_name: string | null } | null;
  schemaIncomplete: boolean;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id, email, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError && isSupabaseSchemaError(adminError)) {
      return {
        user,
        admin: null,
        schemaIncomplete: true,
      };
    }

    if (!admin) return null;

    return { user, admin, schemaIncomplete: false };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, email, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError && isSupabaseSchemaError(adminError)) {
    return {
      user,
      admin: null,
      schemaIncomplete: true,
    };
  }

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return { user, admin, schemaIncomplete: false };
}

export async function redirectIfAdmin() {
  const session = await getAdminSession();
  if (session && !session.schemaIncomplete && session.admin) {
    redirect("/admin");
  }
}
