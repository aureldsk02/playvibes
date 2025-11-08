"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, MessageCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
  }, [showComments, playlistId]);

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const data = await apiClient.post<{ data: Comment }>(`/api/playlists/${playlistId}/comments`, {
        content: newComment.trim(),
      });
      
      setComments((prev) => [data.data, ...prev]);
      setNewComment("");
      
      toast({
        title: "Comment added!",
        description: "Your comment has been posted successfully.",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await apiClient.delete(`/api/playlists/${playlistId}/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error deleting comment",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/1000
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
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
              <div className="text-center text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.user.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {/* Delete button for comment owner */}
                  {currentUserId === comment.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}