import { requireAdmin } from "@/lib/supabase/admin-auth";
import AdminShell from "../AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
