import { ApiClientError } from "@/lib/utils/api-client";

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export class SpotifyApiError extends ApiClientError {
  constructor(message: string, status?: number, spotifyError?: SpotifyError) {
    super(message, status, "SPOTIFY_API_ERROR", spotifyError);
    this.name = "SpotifyApiError";
  }
}

export function handleSpotifyError(error: unknown): never {
  if (error instanceof Response) {
    throw new SpotifyApiError(
      `Spotify API error: ${error.status} ${error.statusText}`,
      error.status
    );
  }

  if (error && typeof error === "object" && "error" in error) {
    const spotifyError = error as SpotifyError;
    throw new SpotifyApiError(
      spotifyError.error.message,
      spotifyError.error.status,
      spotifyError
    );
  }

  if (error instanceof Error) {
    throw new SpotifyApiError(error.message);
  }

  throw new SpotifyApiError("Unknown Spotify API error");
}

export function isSpotifyTokenExpired(error: unknown): boolean {
  return (
    error instanceof SpotifyApiError &&
    (error.status === 401 || error.message.includes("token"))
  );
}

export function isSpotifyRateLimited(error: unknown): boolean {
  return error instanceof SpotifyApiError && error.status === 429;
}

export function getSpotifyErrorMessage(error: unknown): string {
  if (error instanceof SpotifyApiError) {
    switch (error.status) {
      case 401:
        return "Your Spotify session has expired. Please reconnect your account.";
      case 403:
        return "You don't have permission to access this Spotify resource.";
      case 404:
        return "The requested Spotify resource was not found.";
      case 429:
        return "Too many requests to Spotify. Please try again in a moment.";
      case 500:
      case 502:
      case 503:
        return "Spotify is currently experiencing issues. Please try again later.";
      default:
        return error.message || "An error occurred with Spotify.";
    }
  }

  return "An unexpected error occurred with Spotify.";
}