"use client";

import { PlaylistSelector } from "@/components/playlists/playlist-selector";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function ManagePage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage Your Playlists</h1>
            <p className="text-gray-600">
              Share your favorite playlists with the community and discover new music.
            </p>
          </div>
          
          <PlaylistSelector 
            onPlaylistToggle={(playlistId, isShared) => {
              console.log(`Playlist ${playlistId} is now ${isShared ? 'shared' : 'unshared'}`);
            }}
          />
        </div>
      </div>
    </AuthGuard>
  );
}