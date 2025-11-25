"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { SpotifyTrack } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface TrackListProps {
  tracks: SpotifyTrack[];
  onTrackPlay?: (trackUri: string, trackIndex: number) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
  className?: string;
}

export function TrackList({
  tracks,
  onTrackPlay,
  currentTrackId,
  isPlaying = false,
  className,
}: TrackListProps) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTrackClick = (track: SpotifyTrack, index: number) => {
    if (onTrackPlay) {
      onTrackPlay(`spotify:track:${track.id}`, index);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tracks found in this playlist
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {/* Header */}
      <div className="grid grid-cols-[44px_1fr_80px] md:grid-cols-[44px_1fr_1fr_80px] gap-3 md:gap-4 px-3 md:px-4 py-2 text-sm text-muted-foreground border-b border-border">
        <div className="text-center">#</div>
        <div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="text-right">Duration</div>
      </div>

      {/* Track list */}
      <div className="space-y-0.5">
        {tracks.map((track, index) => {
          const isCurrentTrack = track.id === currentTrackId;
          const isHovered = hoveredTrack === track.id;
          const showPlayButton = isHovered || isCurrentTrack;

          return (
            <div
              key={`${track.id}-${index}`}
              className={cn(
                "grid grid-cols-[44px_1fr_80px] md:grid-cols-[44px_1fr_1fr_80px] gap-3 md:gap-4 px-3 md:px-4 py-2 rounded-md transition-colors group cursor-pointer min-h-[60px]",
                isCurrentTrack
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50"
              )}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
              onClick={() => handleTrackClick(track, index)}
            >
              {/* Track number / Play button - Minimum 44x44px touch target */}
              <div className="flex items-center justify-center">
                {showPlayButton ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="min-w-[44px] min-h-[44px] w-11 h-11"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackClick(track, index);
                    }}
                    aria-label={isCurrentTrack && isPlaying ? "Pause track" : "Play track"}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Track info */}
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                {track.album.images[0] && (
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded overflow-hidden">
                    <OptimizedImage
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 40px, 48px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "font-medium truncate text-sm sm:text-base",
                      isCurrentTrack && "text-primary"
                    )}
                  >
                    {track.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </div>
                </div>
              </div>

              {/* Album name */}
              <div className="hidden md:flex items-center min-w-0">
                <span className="text-sm text-muted-foreground truncate">
                  {track.album.name}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-end">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
