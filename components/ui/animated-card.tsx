import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: "lift" | "glow" | "scale" | "none";
  gradient?: boolean;
  glass?: boolean;
}

const hoverEffects = {
  lift: "hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10",
  glow: "hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30",
  scale: "hover:scale-[1.02]",
  none: "",
};

export function AnimatedCard({ 
  children, 
  className, 
  hover = "lift",
  gradient = false,
  glass = false
}: AnimatedCardProps) {
  return (
    <div className={cn(
      "rounded-xl border transition-all duration-300 ease-out",
      hoverEffects[hover],
      gradient && "bg-gradient-to-br from-card to-card/50",
      glass && "backdrop-blur-sm bg-card/80",
      !gradient && !glass && "bg-card",
      "border-border",
      className
    )}>
      {children}
    </div>
  );
}