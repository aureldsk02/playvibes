"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptimisticUpdate } from "@/hooks/use-optimistic-update";
import { apiClient } from "@/lib/utils/api-client";

interface LikeButtonProps {
  playlistId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
  onLikeChange?: (isLiked: boolean, likesCount: number) => void;
}

export function LikeButton({
  playlistId,
  initialLikesCount,
  initialIsLiked,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const previousStateRef = useRef({ isLiked: initialIsLiked, likesCount: initialLikesCount });

  const { execute: handleLike, isLoading } = useOptimisticUpdate<
    void,
    { isLiked: boolean; likesCount: number; message: string }
  >({
    mutationFn: async () => {
      // Store previous state before mutation
      previousStateRef.current = { isLiked, likesCount };
      
      // Perform optimistic update
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);
      onLikeChange?.(newIsLiked, newLikesCount);

      // Make API call
      const method = previousStateRef.current.isLiked ? "DELETE" : "POST";
      const data = method === "DELETE" 
        ? await apiClient.delete<{
            isLiked: boolean;
            likesCount: number;
            message: string;
          }>(`/api/playlists/${playlistId}/like`)
        : await apiClient.post<{
            isLiked: boolean;
            likesCount: number;
            message: string;
          }>(`/api/playlists/${playlistId}/like`);
      
      return data;
    },
    onSuccess: (data) => {
      // Update with server response (in case of discrepancy)
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      onLikeChange?.(data.isLiked, data.likesCount);
    },
    rollbackFn: () => {
      // Revert optimistic update on error
      setIsLiked(previousStateRef.current.isLiked);
      setLikesCount(previousStateRef.current.likesCount);
      onLikeChange?.(previousStateRef.current.isLiked, previousStateRef.current.likesCount);
    },
    successMessage: isLiked ? "Playlist unliked" : "Playlist liked!",
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 transition-colors min-h-[44px] px-3",
        isLiked && "text-red-500 hover:text-red-600"
      )}
      aria-label={isLiked ? `Unlike playlist (${likesCount} likes)` : `Like playlist (${likesCount} likes)`}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isLiked && "fill-current"
        )}
      />
      <span className="text-sm font-medium">
        {likesCount}
      </span>
    </Button>
  );
}