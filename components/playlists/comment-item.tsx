"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  onDelete?: (commentId: string) => Promise<void>;
  canDelete: boolean;
  className?: string;
}

export function CommentItem({
  comment,
  onDelete,
  canDelete,
  className,
}: CommentItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
      setShowDeleteDialog(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={cn("flex gap-3 group", className)}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user.image || undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(comment.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">
              {comment.user.name || "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>

        {/* Delete button for comment owner */}
        {canDelete && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 flex-shrink-0"
            title="Delete comment"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
