import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border overflow-hidden animate-pulse">
      {/* Playlist image */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Playlist Info */}
      <div className="p-4 space-y-3">
        {/* Title and description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          {/* Track count and creator */}
          <div className="flex items-center space-x-2 pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}