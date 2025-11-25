import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CommentSkeletonProps {
  count?: number;
  className?: string;
}

export function CommentSkeleton({ count = 3, className }: CommentSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3">
          {/* Avatar */}
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          
          {/* Comment content */}
          <div className="flex-1 space-y-2">
            {/* User name and timestamp */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            {/* Comment text */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
