"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  className?: string;
  maxLength?: number;
}

export function CommentForm({
  onSubmit,
  isSubmitting,
  className,
  maxLength = 500,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    await onSubmit(content.trim());
    setContent("");
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)} aria-label="Add a comment">
      <label htmlFor="comment-input" className="sr-only">
        Comment text
      </label>
      <Textarea
        id="comment-input"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={cn(
          "min-h-[80px] sm:min-h-[100px] resize-none text-base",
          isOverLimit && "border-destructive focus-visible:ring-destructive"
        )}
        maxLength={maxLength}
        disabled={isSubmitting}
        aria-label="Comment text"
        aria-describedby="char-count"
        aria-invalid={isOverLimit}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span
          id="char-count"
          className={cn(
            "text-xs sm:text-sm",
            isOverLimit
              ? "text-destructive font-medium"
              : remainingChars < 50
              ? "text-yellow-600 dark:text-yellow-500"
              : "text-muted-foreground"
          )}
          aria-live="polite"
        >
          {content.length}/{maxLength} characters
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting || isOverLimit}
          className="min-h-[44px] w-full sm:w-auto px-6"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
