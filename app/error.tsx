"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="mb-2 text-xs tracking-[0.3em] text-champagne">ERROR</p>
      <h1 className="mb-3 font-serif text-4xl font-semibold text-foreground">
        حدث خطأ غير متوقع
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted">
        نعتذر عن الإزعاج. حاولي تحديث الصفحة أو العودة لاحقاً.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-foreground px-8 py-3 text-sm text-ivory transition hover:bg-champagne"
        >
          إعادة المحاولة
        </button>
        <a
          href="/"
          className="rounded-full border border-champagne/30 px-8 py-3 text-sm text-foreground transition hover:bg-beige"
        >
          الرئيسية
        </a>
      </div>
    </div>
  );
}
