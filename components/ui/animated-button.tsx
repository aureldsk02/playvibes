"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface AnimatedButtonProps extends ButtonProps {
  animation?: "bounce" | "scale" | "slide" | "glow" | "none";
  loading?: boolean;
}

const animationClasses = {
  bounce: "hover:animate-bounce",
  scale: "hover:scale-105 active:scale-95 transition-transform duration-200",
  slide: "hover:-translate-y-0.5 transition-transform duration-200",
  glow: "hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300",
  none: "",
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animation = "scale", loading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          animationClasses[animation],
          loading && "cursor-not-allowed opacity-70",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";