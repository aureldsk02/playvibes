import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-background rounded-lg p-8 shadow-sm border">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>

        {/* User info skeleton */}
        <div className="flex-1 text-center md:text-left w-full">
          {/* Name */}
          <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2" />
          {/* Email */}
          <Skeleton className="h-5 w-64 mx-auto md:mx-0 mb-4" />

          {/* Statistics */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-6">
            {/* Shared Playlists */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Likes Received */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Saves Received */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
