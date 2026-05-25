"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase غير مُفعّل — أضيفي .env.local");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center luxury-gradient px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 luxury-shadow-lg">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl tracking-[0.15em] text-foreground">
            LIMORA
          </p>
          <p className="mt-2 text-sm text-muted">لوحة تحكم الإدارة</p>
        </div>

        {(error || searchParams.get("error")) && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error || "غير مصرح لك بالدخول"}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-champagne/20 px-4 py-3 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-champagne/20 px-4 py-3 text-sm outline-none focus:border-champagne"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-ivory hover:bg-champagne disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
