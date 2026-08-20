export default function Loading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" aria-hidden="true" />
        <span>Loading PlayboyZone…</span>
      </div>
    </main>
  );
}
