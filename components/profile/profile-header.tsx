"use client";

import { UserProfileResponse } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Music, Heart, Bookmark } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfileResponse;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user, stats } = profile;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-background to-background rounded-lg p-4 sm:p-6 md:p-8 shadow-sm border">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white text-3xl sm:text-4xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {user.name || "Anonymous User"}
          </h1>
          {user.email && (
            <p className="text-sm sm:text-base text-muted-foreground mb-4">{user.email}</p>
          )}

          {/* Statistics */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-start mt-4 md:mt-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.sharedPlaylistsCount}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Shared Playlists
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalLikesReceived}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Likes Received
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalSavesReceived}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Saves Received
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
