"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { SpotifyConnectButton } from "./spotify-connect-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

interface SpotifyConnectionStatus {
  isConnected: boolean;
  spotifyId?: string;
  lastUpdated?: string;
}

export function UserProfile() {
  const { data: session, isPending } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [spotifyStatus, setSpotifyStatus] = useState<SpotifyConnectionStatus>({
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
      setIsSigningOut(true);
      setIsDropdownOpen(false);
      
      const { signOut } = await import("@/lib/auth/client");
      await signOut();
      
      // Show success toast
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
        variant: "success",
        duration: 3000,
      });
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setIsSigningOut(false);
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
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="hidden sm:block w-24 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px]"
        aria-label={`User menu for ${session.user.name || session.user.email || 'user'}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-primary/20"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center border-2 border-primary/20">
            <span className="text-white text-sm font-medium">
              {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {session.user.name || "User"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-50 py-2"
            role="menu"
            aria-label="User menu"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
              {spotifyStatus.isConnected && spotifyStatus.spotifyId && (
                <p className="text-xs text-green-600 mt-1">
                  Spotify: {spotifyStatus.spotifyId}
                </p>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
                onClick={() => setIsDropdownOpen(false)}
                role="menuitem"
              >
                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                View Profile
              </Link>

              <div className="px-4 py-2">
                <SpotifyConnectButton
                  isConnected={spotifyStatus.isConnected}
                  onConnect={checkSpotifyConnection}
                  className="w-full text-xs"
                />
              </div>

              {spotifyStatus.isConnected && (
                <div className="px-4 py-2">
                  <Button
                    onClick={handleRefreshToken}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Refresh Token
                  </Button>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <div className="border-t pt-2">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                role="menuitem"
                aria-label="Sign out of your account"
              >
                <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}