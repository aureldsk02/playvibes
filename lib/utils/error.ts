"use client";

export interface ErrorInfo {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: string;
  userId?: string;
  timestamp: Date;
}

class GlobalErrorHandler {
  private errorQueue: ErrorInfo[] = [];
  private isProcessing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers();
    }
  }

  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));

      this.handleError({
        error,
        context: 'unhandledrejection',
        timestamp: new Date(),
      });

      // Prevent the default browser behavior
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      
      this.handleError({
        error: event.error || new Error(event.message),
        context: 'uncaught',
        timestamp: new Date(),
      });
    });
  }

  handleError(errorInfo: ErrorInfo) {
    this.errorQueue.push(errorInfo);
    
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue() {
    this.isProcessing = true;

    while (this.errorQueue.length > 0) {
      const errorInfo = this.errorQueue.shift()!;
      
      try {
        await this.logError(errorInfo);
      } catch (loggingError) {
        console.error('Failed to log error:', loggingError);
      }
    }

    this.isProcessing = false;
  }

  private async logError(errorInfo: ErrorInfo) {
    // In a production app, you would send this to your error tracking service
    // For now, we'll just log to console with structured data
    console.group('🚨 Error Report');
    console.error('Error:', errorInfo.error);
    console.log('Context:', errorInfo.context);
    console.log('Timestamp:', errorInfo.timestamp.toISOString());
    console.log('User ID:', errorInfo.userId || 'anonymous');
    
    if (errorInfo.errorInfo) {
      console.log('Component Stack:', errorInfo.errorInfo.componentStack);
    }
    
    console.log('Stack Trace:', errorInfo.error.stack);
    console.groupEnd();

    // You could also send to an error tracking service like Sentry:
    // Sentry.captureException(errorInfo.error, {
    //   contexts: {
    //     errorInfo: errorInfo.errorInfo,
    //     custom: {
    //       context: errorInfo.context,
    //       userId: errorInfo.userId,
    //     },
    //   },
    // });
  }

  // Method to manually report errors
  reportError(error: Error, context?: string, userId?: string) {
    this.handleError({
      error,
      context,
      userId,
      timestamp: new Date(),
    });
  }
}

// Create a singleton instance
export const globalErrorHandler = new GlobalErrorHandler();

// Hook for React components to report errors
export function useErrorReporting() {
  return {
    reportError: (error: Error, context?: string) => {
      globalErrorHandler.reportError(error, context);
    },
  };
}