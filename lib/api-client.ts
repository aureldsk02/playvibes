export interface ApiError extends Error {
  status?: number;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export class ApiClientError extends Error implements ApiError {
  status?: number;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: ApiError) => boolean;
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry on network errors, 5xx errors, and 429 (rate limit)
    return !error.status || error.status >= 500 || error.status === 429;
  },
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const finalRetryOptions = { ...defaultRetryOptions, ...retryOptions };
  let lastError: ApiError;

  for (let attempt = 0; attempt <= finalRetryOptions.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let errorDetails: any;

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          errorDetails = errorData;
        } catch {
          // If we can't parse the error response, use the default message
        }

        const error = new ApiClientError(
          errorMessage,
          response.status,
          response.status.toString(),
          errorDetails
        );

        // Don't retry on client errors (4xx) except 429
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw error;
        }

        lastError = error;

        // Check if we should retry this error
        if (!finalRetryOptions.retryCondition(error)) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === finalRetryOptions.maxRetries) {
          throw error;
        }

        // Calculate delay for next retry
        const delay = Math.min(
          finalRetryOptions.baseDelay * Math.pow(finalRetryOptions.backoffFactor, attempt),
          finalRetryOptions.maxDelay
        );

        console.warn(`API request failed (attempt ${attempt + 1}/${finalRetryOptions.maxRetries + 1}), retrying in ${delay}ms:`, error.message);

        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Success - parse and return the response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return response.text() as unknown as T;
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        lastError = error;
      } else {
        // Network error or other non-HTTP error
        lastError = new ApiClientError(
          error instanceof Error ? error.message : "Network error",
          undefined,
          "NETWORK_ERROR",
          error
        );
      }

      // Don't retry on the last attempt
      if (attempt === finalRetryOptions.maxRetries) {
        throw lastError;
      }

      // Check if we should retry this error
      if (!finalRetryOptions.retryCondition(lastError)) {
        throw lastError;
      }

      // Calculate delay for next retry
      const delay = Math.min(
        finalRetryOptions.baseDelay * Math.pow(finalRetryOptions.backoffFactor, attempt),
        finalRetryOptions.maxDelay
      );

      console.warn(`API request failed (attempt ${attempt + 1}/${finalRetryOptions.maxRetries + 1}), retrying in ${delay}ms:`, lastError.message);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Convenience methods for different HTTP verbs
export const apiClient = {
  get: <T>(url: string, options?: RequestInit, retryOptions?: RetryOptions) =>
    apiRequest<T>(url, { ...options, method: "GET" }, retryOptions),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, data?: any, options?: RequestInit, retryOptions?: RetryOptions) =>
    apiRequest<T>(
      url,
      {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      retryOptions
    ),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, data?: any, options?: RequestInit, retryOptions?: RetryOptions) =>
    apiRequest<T>(
      url,
      {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      retryOptions
    ),

  delete: <T>(url: string, options?: RequestInit, retryOptions?: RetryOptions) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }, retryOptions),
};

// Helper to determine if an error is retryable
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return defaultRetryOptions.retryCondition(error);
  }
  return true; // Network errors are generally retryable
}

// Helper to get user-friendly error messages
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}