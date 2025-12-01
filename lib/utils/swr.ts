import { SWRConfiguration } from 'swr';
import { apiClient } from './api-client';

// Default fetcher function for SWR
export const fetcher = async <T>(url: string): Promise<T> => {
  return apiClient.get<T>(url);
};

// SWR global configuration with 5-minute cache
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds deduplication
  focusThrottleInterval: 60000, // 1 minute throttle on focus revalidation
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  // 5-minute cache as per requirements
  refreshInterval: 0, // Don't auto-refresh
  revalidateIfStale: true,
  shouldRetryOnError: true,
};

// Cache time constants
export const CACHE_TIME = {
  PLAYLIST: 5 * 60 * 1000, // 5 minutes
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  SPOTIFY_TRACKS: 5 * 60 * 1000, // 5 minutes
  SHORT: 1 * 60 * 1000, // 1 minute
  LONG: 10 * 60 * 1000, // 10 minutes
} as const;
