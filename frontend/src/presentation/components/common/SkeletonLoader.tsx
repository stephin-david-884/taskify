interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/70 ${className}`}
    />
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-3.5 px-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="flex h-64 flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
      <Skeleton className="h-5 w-40" />
      <div className="flex items-end justify-between gap-4 pt-8">
        <Skeleton className="h-32 flex-1 rounded-t-lg" />
        <Skeleton className="h-44 flex-1 rounded-t-lg" />
        <Skeleton className="h-24 flex-1 rounded-t-lg" />
      </div>
    </div>
  );
};
