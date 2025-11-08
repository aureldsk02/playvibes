import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
  minItemWidth?: string;
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
  xl: "gap-8 sm:gap-10",
};

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { default: 1, sm: 2, lg: 3, xl: 4, "2xl": 5 },
  gap = "md",
  minItemWidth
}: ResponsiveGridProps) {
  const gridClasses = minItemWidth 
    ? `grid-cols-[repeat(auto-fill,minmax(${minItemWidth},1fr))]`
    : [
        cols.default && `grid-cols-${cols.default}`,
        cols.sm && `sm:grid-cols-${cols.sm}`,
        cols.md && `md:grid-cols-${cols.md}`,
        cols.lg && `lg:grid-cols-${cols.lg}`,
        cols.xl && `xl:grid-cols-${cols.xl}`,
        cols["2xl"] && `2xl:grid-cols-${cols["2xl"]}`,
      ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "grid",
      gridClasses,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}