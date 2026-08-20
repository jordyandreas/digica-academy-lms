function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className ?? ""}`}
      aria-hidden
    />
  );
}

function FormFieldSkeleton({ showDescription = false }: { showDescription?: boolean }) {
  return (
    <div className="w-full">
      <SkeletonBlock className="h-4 w-20 rounded bg-brand-pale/80" />
      <SkeletonBlock className="mt-2 h-10 w-full rounded-md bg-background/80 ring-1 ring-border/60" />
      {showDescription ? (
        <SkeletonBlock className="mt-2 h-3 w-52 rounded bg-muted/70" />
      ) : null}
    </div>
  );
}

function RadioCardSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-brand-periwinkle/40 bg-background/60 p-3">
      <SkeletonBlock className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <SkeletonBlock className="h-3.5 w-24 rounded" />
        <SkeletonBlock className="h-3 w-full rounded bg-muted/70" />
      </div>
    </div>
  );
}

/** Mirrors the loaded check-in layout: header, step boxes, fields, and submit CTA. */
export function CheckInPageSkeleton({ isWorkshop = true }: { isWorkshop?: boolean }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <p className="sr-only">Memuat halaman absensi…</p>

      <div className="space-y-1 text-center">
        <SkeletonBlock className="mx-auto h-7 w-4/5 max-w-xs rounded bg-brand-pale/60" />
        {!isWorkshop ? (
          <SkeletonBlock className="mx-auto h-4 w-full max-w-[17rem] rounded bg-muted" />
        ) : null}
      </div>

      <div className="space-y-5">
        {isWorkshop ? (
          <div className="space-y-3 rounded-xl border border-brand-periwinkle/50 bg-brand-pale/15 p-4">
            <div className="space-y-1">
              <SkeletonBlock className="h-4 w-28 rounded bg-brand-pale/80" />
              <SkeletonBlock className="h-3 w-full max-w-[15rem] rounded bg-muted/70" />
            </div>
            <FormFieldSkeleton />
            <FormFieldSkeleton showDescription />
          </div>
        ) : (
          <>
            <FormFieldSkeleton />
            <FormFieldSkeleton showDescription />
          </>
        )}

        {isWorkshop ? (
          <div className="space-y-3 rounded-xl border border-brand-periwinkle/60 bg-brand-pale/25 p-4">
            <div className="space-y-1">
              <SkeletonBlock className="h-4 w-56 rounded bg-brand-pale/80" />
              <SkeletonBlock className="h-3 w-full rounded bg-muted/70" />
              <SkeletonBlock className="h-3 w-4/5 rounded bg-muted/70" />
            </div>

            <div className="space-y-2">
              <RadioCardSkeleton />
              <RadioCardSkeleton />
              <RadioCardSkeleton />
            </div>
          </div>
        ) : null}

        <SkeletonBlock className="h-10 w-full rounded-md bg-brand-royal/15" />
      </div>
    </div>
  );
}
