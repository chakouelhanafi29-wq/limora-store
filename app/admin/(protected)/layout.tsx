import { requireAdmin } from "@/lib/supabase/admin-auth";
import AdminShell from "../AdminShell";
import SchemaSetupBanner from "../components/SchemaSetupBanner";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminShell>
      {session.schemaIncomplete && <SchemaSetupBanner />}
      {children}
    </AdminShell>
  );
}
