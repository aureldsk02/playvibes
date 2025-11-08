"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { SpotifyConnectButton } from "./spotify-connect-button";
import { Button } from "@/components/ui/button";

interface SpotifyConnectionStatus {
  isConnected: boolean;
  spotifyId?: string;
  lastUpdated?: string;
}

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const [spotifyStatus, setSpotifyStatus] = useState<SpotifyConnectionStatus>({
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      checkSpotifyConnection();
    }
  }, [session]);

  const checkSpotifyConnection = async () => {
    try {
      const response = await fetch("/api/auth/spotify/status");
      if (response.ok) {
        const data = await response.json();
        setSpotifyStatus(data);
      }
    } catch (error) {
      console.error("Error checking Spotify connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { signOut } = await import("@/lib/auth-client");
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });
      
      if (response.ok) {
        alert("Token refreshed successfully!");
        checkSpotifyConnection();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      alert("Failed to refresh token");
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex-shrink-0">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {session.user.name || "User"}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {session.user.email}
        </p>
        {spotifyStatus.isConnected && spotifyStatus.spotifyId && (
          <p className="text-xs text-green-600">
            Spotify: {spotifyStatus.spotifyId}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <SpotifyConnectButton
          isConnected={spotifyStatus.isConnected}
          onConnect={checkSpotifyConnection}
          className="text-xs"
        />
        
        {spotifyStatus.isConnected && (
          <Button
            onClick={handleRefreshToken}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Refresh Token
          </Button>
        )}
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}