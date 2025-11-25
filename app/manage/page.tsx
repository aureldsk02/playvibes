"use client";

import { PlaylistSelector } from "@/components/playlists/playlist-selector";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";

export default function ManagePage() {
  return (
    <AuthGuard>
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage Your Playlists</h1>
            <p className="text-gray-600">
              Share your favorite playlists with the community and discover new music.
            </p>
          </div>
          
          <ErrorBoundary>
            <PlaylistSelector 
              onPlaylistToggle={(playlistId, isShared) => {
                console.log(`Playlist ${playlistId} is now ${isShared ? 'shared' : 'unshared'}`);
              }}
            />
          </ErrorBoundary>
        </div>
      </main>
    </AuthGuard>
  );
}