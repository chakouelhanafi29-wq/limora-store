export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-champagne/30 border-t-champagne" />
        <p className="font-serif text-lg text-foreground">LIMORA</p>
        <p className="mt-1 text-xs text-muted">جاري التحميل...</p>
      </div>
    </div>
  );
}
