import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, XCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
  variant?: "default" | "compact" | "inline";
  className?: string;
  type?: "error" | "network" | "notFound" | "generic";
}

export function ErrorMessage({
  message = "An unexpected error occurred. Please try again.",
  title,
  onRetry,
  variant = "default",
  className,
  type = "generic",
}: ErrorMessageProps) {
  const getIcon = () => {
    switch (type) {
      case "network":
        return <WifiOff className="h-8 w-8 text-destructive" />;
      case "notFound":
        return <XCircle className="h-8 w-8 text-destructive" />;
      case "error":
        return <AlertTriangle className="h-8 w-8 text-destructive" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-destructive" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "error":
        return "Error";
      default:
        return "Something went wrong";
    }
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-auto p-1 text-destructive hover:text-destructive"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20", className)}>
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-destructive font-medium">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[200px] p-6 text-center", className)}>
      <div className="mb-4">{getIcon()}</div>
      <h3 className="text-lg font-semibold mb-2">{title || getDefaultTitle()}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
