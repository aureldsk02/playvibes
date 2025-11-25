"use client";

import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: "genre" | "mood" | "activity";
}

const variantStyles = {
  genre: "bg-primary/10 text-primary hover:bg-primary/20",
  mood: "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
  activity: "bg-accent text-accent-foreground hover:bg-accent/80",
};

export function FilterChip({ label, onRemove, variant = "genre" }: FilterChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors ${variantStyles[variant]}`}
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-full"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
