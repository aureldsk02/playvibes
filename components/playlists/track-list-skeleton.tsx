import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TrackListSkeletonProps {
  count?: number;
  className?: string;
}

export function TrackListSkeleton({ count = 5, className }: TrackListSkeletonProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
        <div className="text-center">#</div>
        <div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="text-right">Duration</div>
      </div>

      {/* Track list skeleton */}
      <div className="space-y-0.5">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-2 rounded-md"
          >
            {/* Track number */}
            <div className="flex items-center justify-center">
              <Skeleton className="h-4 w-4" />
            </div>

            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>

            {/* Album name */}
            <div className="hidden md:flex items-center min-w-0">
              <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Duration */}
            <div className="flex items-center justify-end">
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
