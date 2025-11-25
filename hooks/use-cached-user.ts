import useSWR from 'swr';
import { CACHE_TIME } from '@/lib/swr-config';

interface UserStats {
  sharedPlaylistsCount: number;
  totalLikesReceived: number;
  totalSavesReceived: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  spotifyId?: string;
}

interface UserProfileResponse {
  user: UserProfile;
  stats: UserStats;
}

interface UserPlaylistsResponse {
  playlists: unknown[];
  total: number;
  page: number;
  limit: number;
}

export function useCachedUserProfile(userId: string | null) {
  const url = userId ? `/api/users/${userId}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<UserProfileResponse>(
    url,
    {
      dedupingInterval: CACHE_TIME.USER_PROFILE,
      revalidateOnFocus: false,
    }
  );
  
  return {
    user: data?.user,
    stats: data?.stats,
    isLoading,
    error,
    mutate,
  };
}

export function useCachedUserPlaylists(userId: string | null, page = 1, limit = 12) {
  const url = userId ? `/api/users/${userId}/playlists?page=${page}&limit=${limit}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<UserPlaylistsResponse>(
    url,
    {
      dedupingInterval: CACHE_TIME.USER_PROFILE,
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
