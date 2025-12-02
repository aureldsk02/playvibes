"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/utils/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { useOptimisticUpdate } from "@/hooks/use-optimistic-update";

interface Comment {
  id: string;
  playlistId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  playlistId: string;
  currentUserId?: string;
  className?: string;
}

export function CommentSection({
  playlistId,
  currentUserId,
  className,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const optimisticCommentRef = useRef<Comment | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<{ data: Comment[] }>(`/api/playlists/${playlistId}/comments`);
      setComments(data.data || []);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({
        title: "Error loading comments",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load comments when component mounts or when showComments becomes true
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments, playlistId]);

  // Submit new comment with optimistic update
  const { execute: submitComment } = useOptimisticUpdate<void, { data: Comment }>({
    mutationFn: async () => {
      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        playlistId,
        userId: currentUserId || "",
        content: optimisticCommentRef.current?.content || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: currentUserId || "",
          name: optimisticCommentRef.current?.user.name || null,
          image: optimisticCommentRef.current?.user.image || null,
        },
      };

      // Add optimistic comment to the list
      setComments((prev) => [optimisticComment, ...prev]);

      // Make API call
      const data = await apiClient.post<{ data: Comment }>(
        `/api/playlists/${playlistId}/comments`,
        {
          content: optimisticCommentRef.current?.content,
        }
      );

      return data;
    },
    onSuccess: (data) => {
      // Replace optimistic comment with real one
      setComments((prev) =>
        prev.map((comment) =>
          comment.id.startsWith("temp-") ? data.data : comment
        )
      );
    },
    rollbackFn: () => {
      // Remove optimistic comment on error
      setComments((prev) => prev.filter((comment) => !comment.id.startsWith("temp-")));
    },
    successMessage: "Comment posted successfully!",
  });

  const handleSubmitComment = async (content: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Store comment data for optimistic update
    optimisticCommentRef.current = {
      id: "",
      playlistId,
      userId: currentUserId || "",
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: currentUserId || "",
        name: null, // Will be filled from session
        image: null, // Will be filled from session
      },
    };

    await submitComment();
    setIsSubmitting(false);
  };

  // Delete comment with optimistic update
  const handleDeleteComment = async (commentId: string) => {
    const commentToDelete = comments.find((c) => c.id === commentId);
    if (!commentToDelete) return;

    // Optimistically remove comment
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    try {
      await apiClient.delete(`/api/playlists/${playlistId}/comments/${commentId}`);

      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      // Rollback: add comment back
      setComments((prev) => [commentToDelete, ...prev]);

      toast({
        title: "Error deleting comment",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Comments toggle button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </Button>

      {showComments && (
        <div className="space-y-4">
          {/* Add comment form */}
          {currentUserId && (
            <CommentForm
              onSubmit={handleSubmitComment}
              isSubmitting={isSubmitting}
              maxLength={500}
            />
          )}

          {/* Comments list */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchComments}
                  className="flex items-center gap-2"
                >
                  Try Again
                </Button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  No comments yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  canDelete={currentUserId === comment.userId}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}