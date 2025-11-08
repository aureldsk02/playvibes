"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/api-client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousState = { isLiked, likesCount };
    
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    onLikeChange?.(newIsLiked, newLikesCount);
    
    try {
      const method = previousState.isLiked ? "DELETE" : "POST";
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
      
      // Update with server response (in case of discrepancy)
      setIsLiked(data.isLiked);
      setLikesCount(data.likesCount);
      onLikeChange?.(data.isLiked, data.likesCount);

      toast({
        title: data.isLiked ? "Playlist liked!" : "Playlist unliked",
        description: data.message,
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      // Revert optimistic update
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      onLikeChange?.(previousState.isLiked, previousState.likesCount);

      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          isLiked && "fill-current"
        )}
      />
      <span className="text-sm font-medium">
        {likesCount}
      </span>
    </Button>
  );
}