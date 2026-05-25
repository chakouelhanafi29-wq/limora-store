import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
      <p className="mb-2 text-xs tracking-[0.3em] text-champagne">404</p>
      <h1 className="mb-3 font-serif text-4xl font-semibold text-foreground">
        الصفحة غير موجودة
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted">
        عذراً، الصفحة التي تبحثين عنها غير متوفرة أو تم نقلها. يمكنكِ العودة
        للمتجر ومواصلة التسوق.
      </p>
      <Link
        href="/"
        className="rounded-full bg-foreground px-8 py-3 text-sm text-ivory transition hover:bg-champagne"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
