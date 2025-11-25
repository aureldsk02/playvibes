# Playlist Detail View Components

This directory contains the components for displaying detailed playlist information.

## Components

### PlaylistDetailModal

A full-screen modal that displays comprehensive playlist information including:
- Playlist header with cover image, title, description, and creator info
- Statistics (track count, duration, likes, comments)
- Action buttons (play, like, save, share)
- Complete track listing with play functionality
- Comment section

**Usage:**

```tsx
import { PlaylistDetailModal } from '@/components/playlists/playlist-detail-modal';

<PlaylistDetailModal
  playlistId="playlist-id"
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  currentUserId={session?.user?.id}
  onPlay={(playlistId) => handlePlay(playlistId)}
  onTrackPlay={(trackUri, index) => handleTrackPlay(trackUri, index)}
  currentTrackId={currentTrackId}
  isPlaying={isPlaying}
/>
```

### TrackList

Displays a formatted list of tracks with:
- Track number
- Album artwork thumbnail
- Track name and artist
- Album name (hidden on mobile)
- Duration
- Play button on hover
- Highlighting for currently playing track

**Usage:**

```tsx
import { TrackList } from '@/components/playlists/track-list';

<TrackList
  tracks={spotifyTracks}
  onTrackPlay={(trackUri, index) => handleTrackPlay(trackUri, index)}
  currentTrackId={currentTrackId}
  isPlaying={isPlaying}
/>
```

## API Endpoint

### GET /api/playlists/[id]/tracks

Fetches the complete track listing for a playlist from Spotify.

**Features:**
- Handles pagination for large playlists
- Caches track data for 5 minutes
- Filters out unavailable/deleted tracks
- Requires authentication

**Response:**

```json
{
  "playlistId": "internal-playlist-id",
  "spotifyPlaylistId": "spotify-playlist-id",
  "tracks": [
    {
      "id": "track-id",
      "name": "Track Name",
      "artists": [{ "id": "artist-id", "name": "Artist Name" }],
      "album": {
        "id": "album-id",
        "name": "Album Name",
        "images": [{ "url": "image-url" }]
      },
      "duration_ms": 180000,
      "preview_url": "preview-url"
    }
  ],
  "totalTracks": 50
}
```

## Integration

The playlist detail modal is integrated into the browse page. Clicking on any playlist card opens the modal with full details.

See `app/browse/page.tsx` for implementation example.
