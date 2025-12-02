import useSWR from 'swr';
import { CACHE_TIME } from '@/lib/utils/swr';
import type { PlaylistWithDetails } from '@/lib/types';

interface PlaylistsResponse {
  playlists: PlaylistWithDetails[];
  total: number;
  page: number;
  limit: number;
}

interface UsePlaylistsOptions {
  page?: number;
  limit?: number;
  search?: string;
  genres?: string[];
  moods?: string[];
  activities?: string[];
  sortBy?: string;
}

export function useCachedPlaylists(options: UsePlaylistsOptions = {}) {
  const { page = 1, limit = 20, search, genres, moods, activities, sortBy } = options;
  
  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) params.append('search', search);
  if (sortBy) params.append('sortBy', sortBy);
  if (genres?.length) params.append('genres', genres.join(','));
  if (moods?.length) params.append('moods', moods.join(','));
  if (activities?.length) params.append('activities', activities.join(','));
  
  const url = `/api/playlists/public?${params.toString()}`;
  
  const { data, error, isLoading, mutate } = useSWR<PlaylistsResponse>(
    url,
    {
      dedupingInterval: CACHE_TIME.PLAYLIST,
      revalidateOnFocus: false,
    }
  );
  
  return {
    playlists: data?.playlists ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    isLoading,
    error,
    mutate,
  };
}

export function useCachedPlaylist(playlistId: string | null) {
  const url = playlistId ? `/api/playlists/${playlistId}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<PlaylistWithDetails>(
    url,
    {
      dedupingInterval: CACHE_TIME.PLAYLIST,
      revalidateOnFocus: false,
    }
  );
  
  return {
    playlist: data,
    isLoading,
    error,
    mutate,
  };
}

export function useCachedUserPlaylists(userId: string | null) {
  const url = userId ? `/api/playlists/user?userId=${userId}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<PlaylistWithDetails[]>(
    url,
    {
      dedupingInterval: CACHE_TIME.PLAYLIST,
      revalidateOnFocus: false,
    }
  );
  
  return {
    playlists: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useCachedSavedPlaylists() {
  const { data, error, isLoading, mutate } = useSWR<PlaylistWithDetails[]>(
    '/api/playlists/saved',
    {
      dedupingInterval: CACHE_TIME.PLAYLIST,
      revalidateOnFocus: false,
    }
  );
  
  return {
    playlists: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
