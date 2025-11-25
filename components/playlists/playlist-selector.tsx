"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount: number;
  isPublic: boolean;
  isOwner: boolean;
  owner: {
    id: string;
    displayName: string;
  };
}

interface PlaylistSelectorProps {
  onPlaylistToggle?: (playlistId: string, isShared: boolean) => void;
  className?: string;
}

export function PlaylistSelector({ onPlaylistToggle, className }: PlaylistSelectorProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [sharedPlaylists, setSharedPlaylists] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharingStates, setSharingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchUserPlaylists();
    fetchSharedPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists/user");
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      const data = await response.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists/shared");
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSharedPlaylists(new Set(data.playlists.map((p: any) => p.spotifyPlaylistId)));
      }
    } catch (err) {
      console.error("Failed to fetch shared playlists:", err);
    }
  };

  const handleToggleShare = async (playlist: SpotifyPlaylist) => {
    const isCurrentlyShared = sharedPlaylists.has(playlist.id);
    const newSharingState = !isCurrentlyShared;

    setSharingStates(prev => ({ ...prev, [playlist.id]: true }));

    try {
      const response = await fetch("/api/playlists/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyPlaylistId: playlist.id,
          isPublic: newSharingState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sharing status");
      }

      // Update local state
      setSharedPlaylists(prev => {
        const newSet = new Set(prev);
        if (newSharingState) {
          newSet.add(playlist.id);
        } else {
          newSet.delete(playlist.id);
        }
        return newSet;
      });

      onPlaylistToggle?.(playlist.id, newSharingState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update playlist");
    } finally {
      setSharingStates(prev => ({ ...prev, [playlist.id]: false }));
    }
  };

  const handleSyncPlaylist = async (spotifyPlaylistId: string) => {
    setSharingStates(prev => ({ ...prev, [spotifyPlaylistId]: true }));

    try {
      // First get the shared playlist ID from our database
      const sharedResponse = await fetch("/api/playlists/shared");
      if (!sharedResponse.ok) {
        throw new Error("Failed to get shared playlists");
      }

      const sharedData = await sharedResponse.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sharedPlaylist = sharedData.playlists.find((p: any) => p.spotifyPlaylistId === spotifyPlaylistId);

      if (!sharedPlaylist) {
        throw new Error("Playlist is not shared");
      }

      const response = await fetch("/api/playlists/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: sharedPlaylist.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync playlist");
      }

      // Refresh playlists after sync
      await fetchUserPlaylists();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync playlist");
    } finally {
      setSharingStates(prev => ({ ...prev, [spotifyPlaylistId]: false }));
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your playlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => {
            setError(null);
            setLoading(true);
            fetchUserPlaylists();
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-600">No playlists found. Create some playlists in Spotify first!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Playlists</h2>
        <p className="text-gray-600">
          Choose which playlists to share publicly. Only playlists you own can be shared.
        </p>
      </div>

      <div className="grid gap-4">
        {playlists.map((playlist) => {
          const isShared = sharedPlaylists.has(playlist.id);
          const isProcessing = sharingStates[playlist.id];

          return (
            <div
              key={playlist.id}
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                {playlist.imageUrl ? (
                  <Image
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="font-semibold truncate">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-sm text-gray-600 truncate">{playlist.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {playlist.trackCount} tracks • {playlist.isPublic ? "Public" : "Private"}
                  {!playlist.isOwner && ` • by ${playlist.owner.displayName}`}
                </p>
              </div>

              <div className="flex-shrink-0 space-x-2">
                {playlist.isOwner ? (
                  <>
                    <Button
                      variant={isShared ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleShare(playlist)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "..." : isShared ? "Unshare" : "Share"}
                    </Button>
                    {isShared && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncPlaylist(playlist.id)}
                        disabled={isProcessing}
                      >
                        Sync
                      </Button>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded">
                    Not Owner
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}