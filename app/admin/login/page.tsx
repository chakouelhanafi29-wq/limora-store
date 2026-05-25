import { Suspense } from "react";
import { redirectIfAdmin } from "@/lib/supabase/admin-auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  await redirectIfAdmin();

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
