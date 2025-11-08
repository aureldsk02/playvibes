"use client";

import { useState } from "react";
import { SearchFilters } from "@/components/playlists/search-filters";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { PlaylistFilters } from "@/lib/types";
import { usePlayback } from "@/components/playback/playback-provider";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";

export default function BrowsePage() {
  const [filters, setFilters] = useState<PlaylistFilters>({});
  const { playPlaylist, isInitialized } = usePlayback();
  
  // Initialize the Spotify player
  useSpotifyPlayer();

  const handleFiltersChange = (newFilters: PlaylistFilters) => {
    setFilters(newFilters);
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container-responsive py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Discover Playlists
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse and discover playlists shared by the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <SearchFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Playlist Grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <PlaylistGrid
              filters={filters}
              onPlaylistPlay={handlePlaylistPlay}
            />
          </div>
        </div>
      </div>
    </div>
  );
}