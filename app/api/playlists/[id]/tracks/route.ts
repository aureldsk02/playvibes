import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sharedPlaylists } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { spotifyAPI } from '@/lib/spotify';

// Cache for track data (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const tracksCache = new Map<string, { data: unknown; timestamp: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: playlistId } = await params;

    // Get playlist from database
    const [playlist] = await db
      .select()
      .from(sharedPlaylists)
      .where(eq(sharedPlaylists.id, playlistId))
      .limit(1);

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check if playlist is public or user owns it
    if (!playlist.isPublic && playlist.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check cache first
    const cacheKey = `tracks_${playlist.spotifyPlaylistId}`;
    const cached = tracksCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Get valid access token for the user
    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get Spotify access token' },
        { status: 401 }
      );
    }

    // Fetch tracks from Spotify API
    const tracks = await fetchAllPlaylistTracks(
      playlist.spotifyPlaylistId,
      accessToken
    );

    const response = {
      playlistId: playlist.id,
      spotifyPlaylistId: playlist.spotifyPlaylistId,
      tracks,
      totalTracks: tracks.length,
    };

    // Cache the response
    tracksCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    
    if (error instanceof Error && error.message.includes('Spotify API')) {
      return NextResponse.json(
        { error: 'Failed to fetch tracks from Spotify' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function fetchAllPlaylistTracks(
  spotifyPlaylistId: string,
  accessToken: string
) {
  const allTracks = [];
  let offset = 0;
  const limit = 100; // Spotify's max limit per request

  while (true) {
    const response = await spotifyAPI.makeSpotifyRequest(
      `/playlists/${spotifyPlaylistId}/tracks?limit=${limit}&offset=${offset}&fields=items(track(id,name,artists(id,name),album(id,name,images),duration_ms,preview_url)),total`,
      accessToken
    );

    const data = await response.json();
    
    // Filter out null tracks (deleted/unavailable tracks)
    const validTracks = data.items
      .filter((item: { track: unknown }) => item.track !== null)
      .map((item: { track: unknown }) => item.track);
    
    allTracks.push(...validTracks);

    // Check if we've fetched all tracks
    if (offset + limit >= data.total || validTracks.length === 0) {
      break;
    }

    offset += limit;
  }

  return allTracks;
}
