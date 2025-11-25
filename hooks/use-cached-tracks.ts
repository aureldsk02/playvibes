import useSWR from 'swr';
import { CACHE_TIME } from '@/lib/swr-config';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  uri: string;
  preview_url?: string;
}

interface TracksResponse {
  tracks: SpotifyTrack[];
  total: number;
}

export function useCachedPlaylistTracks(playlistId: string | null) {
  const url = playlistId ? `/api/playlists/${playlistId}/tracks` : null;
  
  const { data, error, isLoading, mutate } = useSWR<TracksResponse>(
    url,
    {
      dedupingInterval: CACHE_TIME.SPOTIFY_TRACKS,
      revalidateOnFocus: false,
    }
  );
  
  return {
    tracks: data?.tracks ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
}
