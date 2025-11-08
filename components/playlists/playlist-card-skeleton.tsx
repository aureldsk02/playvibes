import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      {/* Playlist image */}
      <Skeleton className="aspect-square w-full rounded-md" />
      
      {/* Playlist title */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Creator info */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}