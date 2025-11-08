"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/api-client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousState = isSaved;
    
    // Optimistic update
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    onSaveChange?.(newIsSaved);
    
    try {
      const method = previousState ? "DELETE" : "POST";
      const data = method === "DELETE" 
        ? await apiClient.delete<{
            isSaved: boolean;
            message: string;
          }>(`/api/playlists/${playlistId}/save`)
        : await apiClient.post<{
            isSaved: boolean;
            message: string;
          }>(`/api/playlists/${playlistId}/save`);
      
      // Update with server response (in case of discrepancy)
      setIsSaved(data.isSaved);
      onSaveChange?.(data.isSaved);

      toast({
        title: data.isSaved ? "Playlist saved!" : "Playlist removed from saved",
        description: data.message,
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      // Revert optimistic update
      setIsSaved(previousState);
      onSaveChange?.(previousState);

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
      onClick={handleSave}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 transition-colors",
        isSaved && "text-blue-500 hover:text-blue-600"
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-all",
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