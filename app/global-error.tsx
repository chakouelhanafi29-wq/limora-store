"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-ivory text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="mb-2 text-xs tracking-[0.3em] text-[#C4A574]">ERROR</p>
          <h1 className="mb-3 font-serif text-4xl font-semibold">
            تعذّر تحميل المتجر
          </h1>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-[#6b6560]">
            {error.message || "حدث خطأ في التطبيق. حاولي مرة أخرى."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#2c2825] px-8 py-3 text-sm text-[#faf8f5]"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
