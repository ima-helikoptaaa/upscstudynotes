import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-[#ECEAE4] via-[#F3F2EC] to-[#ECEAE4] bg-[length:400%_100%] animate-shimmer",
        className
      )}
    />
  );
}

export function PDFCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-4 shadow-card border border-[var(--color-border)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-10 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

export function FeedSectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40 mb-4" />
      {[1, 2, 3].map((i) => (
        <PDFCardSkeleton key={i} />
      ))}
    </div>
  );
}
