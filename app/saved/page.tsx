"use client";

import { useEffect, useState } from "react";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navigation } from "@/components/navigation";
import { usePlayback } from "@/components/playback/playback-provider";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";
import type { PlaylistWithDetails, PaginatedResponse } from "@/lib/types";

export default function SavedPlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { playPlaylist, isInitialized } = usePlayback();
  
  // Initialize the Spotify player
  useSpotifyPlayer();

  const fetchSavedPlaylists = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/playlists/saved?page=${pageNum}&limit=20`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch saved playlists");
      }

      const data: PaginatedResponse<PlaylistWithDetails> = await response.json();
      
      if (append) {
        setPlaylists(prev => [...prev, ...data.data]);
      } else {
        setPlaylists(data.data);
      }
      
      setHasMore(pageNum < data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlaylists();
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSavedPlaylists(nextPage, true);
  };

  const handlePlaylistUpdate = (playlistId: string, updates: Partial<PlaylistWithDetails>) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, ...updates }
          : playlist
      )
    );
  };

  const handlePlaylistRemove = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const handlePlaylistPlay = async (playlistId: string) => {
    if (!isInitialized) {
      console.warn('Spotify player not initialized');
      return;
    }

    try {
      // Get the playlist details to find the Spotify playlist ID
      const response = await fetch(`/api/playlists/${playlistId}`);
      if (!response.ok) {
        throw new Error('Failed to get playlist details');
      }
      
      const playlist = await response.json();
      const spotifyPlaylistId = playlist.spotifyPlaylistId;
      
      if (!spotifyPlaylistId) {
        throw new Error('Spotify playlist ID not found');
      }

      // Convert Spotify playlist ID to URI format
      const playlistUri = `spotify:playlist:${spotifyPlaylistId}`;
      await playPlaylist(playlistUri);
    } catch (error) {
      console.error('Failed to play playlist:', error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Playlists
          </h1>
          <p className="text-gray-600">
            Your collection of saved playlists from the community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => fetchSavedPlaylists()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {playlists.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved playlists yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start exploring and save playlists you love to see them here.
            </p>
            <a
              href="/browse"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Playlists
            </a>
          </div>
        )}

        <PlaylistGrid
          playlists={playlists}
          loading={loading}
          onPlaylistUpdate={handlePlaylistUpdate}
          onPlaylistRemove={handlePlaylistRemove}
          onPlaylistPlay={handlePlaylistPlay}
          showActions={true}
        />

        {hasMore && playlists.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        </div>
      </div>
    </AuthGuard>
  );
}