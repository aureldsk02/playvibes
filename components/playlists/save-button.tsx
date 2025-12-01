"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptimisticUpdate } from "@/hooks/use-optimistic-update";
import { apiClient } from "@/lib/utils/api-client";

interface SaveButtonProps {
  playlistId: string;
  initialIsSaved: boolean;
  onSaveChange?: (isSaved: boolean) => void;
  showLabel?: boolean;
}

export function SaveButton({
  playlistId,
  initialIsSaved,
  onSaveChange,
  showLabel = false,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const previousStateRef = useRef(initialIsSaved);

  const { execute: handleSave, isLoading } = useOptimisticUpdate<
    void,
    { isSaved: boolean; message: string }
  >({
    mutationFn: async () => {
      // Store previous state before mutation
      previousStateRef.current = isSaved;
      
      // Perform optimistic update
      const newIsSaved = !isSaved;
      setIsSaved(newIsSaved);
      onSaveChange?.(newIsSaved);

      // Make API call
      const method = previousStateRef.current ? "DELETE" : "POST";
      const data = method === "DELETE" 
        ? await apiClient.delete<{
            isSaved: boolean;
            message: string;
          }>(`/api/playlists/${playlistId}/save`)
        : await apiClient.post<{
            isSaved: boolean;
            message: string;
          }>(`/api/playlists/${playlistId}/save`);
      
      return data;
    },
    onSuccess: (data) => {
      // Update with server response (in case of discrepancy)
      setIsSaved(data.isSaved);
      onSaveChange?.(data.isSaved);
    },
    rollbackFn: () => {
      // Revert optimistic update on error
      setIsSaved(previousStateRef.current);
      onSaveChange?.(previousStateRef.current);
    },
    successMessage: isSaved ? "Playlist removed from saved" : "Playlist saved!",
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSave}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 transition-colors min-h-[44px] px-3",
        isSaved && "text-blue-500 hover:text-blue-600"
      )}
      aria-label={isSaved ? "Remove from saved playlists" : "Save playlist"}
    >
      <Bookmark
        className={cn(
          "h-5 w-5 transition-all",
          isSaved && "fill-current"
        )}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  );
}