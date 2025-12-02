"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { UserProfileResponse } from "@/lib/types";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePlaylists } from "@/components/profile/profile-playlists";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePlayback } from "@/components/playback/playback-provider";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";
import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorMessage } from "@/components/ui/error-message";
import { ProfileHeaderSkeleton } from "@/components/profile/profile-header-skeleton";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playPlaylist, isInitialized } = usePlayback();
  
  // Initialize the Spotify player
  useSpotifyPlayer();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
      return;
    }

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session, isPending, router]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${session.user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data: UserProfileResponse = await response.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
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

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8 space-y-8">
          <ProfileHeaderSkeleton />
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading playlists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-responsive py-8">
          <ErrorMessage
            title="Failed to load profile"
            message={error || "Profile not found"}
            onRetry={fetchProfile}
            type="error"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-responsive py-8 space-y-8">
        <ErrorBoundary>
          <ProfileHeader profile={profile} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ProfilePlaylists
            userId={session!.user!.id}
            isOwnProfile={profile.isOwnProfile}
            onPlaylistPlay={handlePlaylistPlay}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
