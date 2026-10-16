import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden
    />
  );
}

function FieldSkeleton({
  labelClassName,
  placeholderClassName = "w-24",
  showDescription = false,
  descriptionClassName = "w-56",
  withChevron = false,
}: {
  labelClassName: string;
  placeholderClassName?: string;
  showDescription?: boolean;
  descriptionClassName?: string;
  withChevron?: boolean;
}) {
  return (
    <div className="w-full">
      <SkeletonBlock className={cn("h-3.5", labelClassName)} />
      <div className="mt-2 flex h-9 items-center rounded-md border border-input bg-background/80 px-3 shadow-sm">
        <SkeletonBlock className={cn("h-3 bg-muted/80", placeholderClassName)} />
        {withChevron ? (
          <SkeletonBlock className="ml-auto h-4 w-4 shrink-0 rounded-sm bg-muted/70" />
        ) : null}
      </div>
      {showDescription ? (
        <SkeletonBlock className={cn("mt-2 h-3", descriptionClassName)} />
      ) : null}
    </div>
  );
}

function ChoiceCardSkeleton({ labelClassName }: { labelClassName: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <SkeletonBlock className={cn("h-4", labelClassName)} />
    </div>
  );
}

const stepCardClassName =
  "space-y-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/10 p-4 shadow-[0_8px_24px_rgba(98,10,121,0.05)]";

/**
 * Default mirrors the shared attendance form (title, helper, two selects, submit).
 * Workshop step cards are only used once the program type is known.
 */
export function CheckInPageSkeleton({ isWorkshop = false }: { isWorkshop?: boolean }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <p className="sr-only">Memuat halaman absensi…</p>

      <div className="space-y-1 text-center">
        <SkeletonBlock className="mx-auto h-7 w-full bg-brand-pale/60" />
        <SkeletonBlock className="mx-auto h-7 w-4/5 bg-brand-pale/60" />
        {!isWorkshop ? (
          <SkeletonBlock className="mx-auto h-4 w-full max-w-[17rem]" />
        ) : null}
      </div>

      <div className="space-y-5">
        {isWorkshop ? (
          <div className={stepCardClassName}>
            <div className="space-y-1">
              <SkeletonBlock className="h-4 w-32 bg-brand-pale/80" />
              <SkeletonBlock className="h-3 w-full max-w-[18rem] bg-muted/70" />
            </div>
            <FieldSkeleton
              labelClassName="w-20"
              placeholderClassName="w-24"
              withChevron
            />
            <FieldSkeleton
              labelClassName="w-10"
              placeholderClassName="w-28"
              showDescription
              descriptionClassName="w-56"
              withChevron
            />
          </div>
        ) : (
          <>
            <FieldSkeleton
              labelClassName="w-20"
              placeholderClassName="w-24"
              withChevron
            />
            <FieldSkeleton
              labelClassName="w-10"
              placeholderClassName="w-28"
              showDescription
              descriptionClassName="w-56"
              withChevron
            />
          </>
        )}

        {isWorkshop ? (
          <div className={stepCardClassName}>
            <div className="space-y-1">
              <SkeletonBlock className="h-4 w-full max-w-[16.5rem] bg-brand-pale/80" />
              <SkeletonBlock className="h-3.5 w-full bg-muted/70" />
              <SkeletonBlock className="h-3.5 w-4/5 bg-muted/70" />
            </div>

            <div className="space-y-2">
              <ChoiceCardSkeleton labelClassName="w-[92%]" />
              <ChoiceCardSkeleton labelClassName="w-44" />
              <ChoiceCardSkeleton labelClassName="w-48" />
            </div>
          </div>
        ) : null}

        <SkeletonBlock className="h-10 w-full bg-brand-royal/15" />
      </div>
    </div>
  );
}

/** Mirrors the recording form before a name is chosen: title, name select, session label + helper, submit. */
export function RecordingCheckInPageSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <p className="sr-only">Memuat halaman laporan recording…</p>

      <div className="space-y-1 text-center">
        <SkeletonBlock className="mx-auto h-7 w-full max-w-xs bg-brand-pale/60" />
        <SkeletonBlock className="mx-auto h-4 w-full max-w-[20rem]" />
        <SkeletonBlock className="mx-auto h-4 w-4/5 max-w-[17rem]" />
      </div>

      <div className="space-y-5">
        <FieldSkeleton
          labelClassName="w-20"
          placeholderClassName="w-24"
          withChevron
        />

        <div className="w-full">
          <SkeletonBlock className="h-3.5 w-44" />
          <SkeletonBlock className="mt-1 h-3 w-56" />
        </div>

        <SkeletonBlock className="h-10 w-full rounded-md bg-brand-royal/15" />
      </div>
    </div>
  );
}
