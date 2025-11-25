import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";
import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { playlistId } = body;

    if (!playlistId) {
      return NextResponse.json(
        { error: "Missing required field: playlistId" },
        { status: 400 }
      );
    }

    // Get the shared playlist from database
    const sharedPlaylist = await db
      .select()
      .from(sharedPlaylists)
      .where(
        and(
          eq(sharedPlaylists.id, playlistId),
          eq(sharedPlaylists.userId, session.user.id)
        )
      )
      .limit(1);

    if (!sharedPlaylist.length) {
      return NextResponse.json(
        { error: "Playlist not found or access denied" },
        { status: 404 }
      );
    }

    // Get valid access token
    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Spotify connection required" },
        { status: 401 }
      );
    }

    const playlist = sharedPlaylist[0];

    // Fetch updated playlist details from Spotify
    const response = await spotifyAPI.makeSpotifyRequest(
      `/playlists/${playlist.spotifyPlaylistId}`,
      accessToken
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch playlist from Spotify" },
        { status: 404 }
      );
    }

    const spotifyPlaylist = await response.json();

    // Fetch playlist tracks to analyze genres/moods (simplified approach)
    const tracksResponse = await spotifyAPI.makeSpotifyRequest(
      `/playlists/${playlist.spotifyPlaylistId}/tracks?limit=50`,
      accessToken
    );

    let genres: string[] = [];
    const moods: string[] = [];
    const activities: string[] = [];

    if (tracksResponse.ok) {
      const tracksData = await tracksResponse.json();

      // Extract genres from track artists (simplified approach)
      const artistIds = tracksData.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.track?.artists?.[0]?.id)
        .filter(Boolean)
        .slice(0, 10); // Limit to first 10 artists to avoid rate limits

      if (artistIds.length > 0) {
        const artistsResponse = await spotifyAPI.makeSpotifyRequest(
          `/artists?ids=${artistIds.join(',')}`,
          accessToken
        );

        if (artistsResponse.ok) {
          const artistsData = await artistsResponse.json();
          const allGenres = artistsData.artists
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .flatMap((artist: any) => artist.genres || [])
            .filter(Boolean) as string[];

          // Get unique genres
          genres = [...new Set(allGenres)].slice(0, 5);
        }
      }

      // Simple mood/activity inference based on playlist name and description
      const text = `${spotifyPlaylist.name} ${spotifyPlaylist.description || ''}`.toLowerCase();

      // Basic mood detection
      if (text.includes('chill') || text.includes('relax')) moods.push('chill');
      if (text.includes('happy') || text.includes('upbeat')) moods.push('happy');
      if (text.includes('sad') || text.includes('melancholy')) moods.push('sad');
      if (text.includes('energetic') || text.includes('pump')) moods.push('energetic');

      // Basic activity detection
      if (text.includes('workout') || text.includes('gym')) activities.push('workout');
      if (text.includes('study') || text.includes('focus')) activities.push('study');
      if (text.includes('party') || text.includes('dance')) activities.push('party');
      if (text.includes('sleep') || text.includes('night')) activities.push('sleep');
      if (text.includes('drive') || text.includes('road')) activities.push('driving');
    }

    // Update the shared playlist with new metadata
    const updatedPlaylist = await db
      .update(sharedPlaylists)
      .set({
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        imageUrl: spotifyPlaylist.images?.[0]?.url,
        trackCount: spotifyPlaylist.tracks.total,
        genres,
        moods,
        activities,
        updatedAt: new Date(),
      })
      .where(eq(sharedPlaylists.id, playlistId))
      .returning();

    return NextResponse.json({
      message: "Playlist synchronized successfully",
      playlist: updatedPlaylist[0],
    });
  } catch (error) {
    console.error("Error synchronizing playlist:", error);
    return NextResponse.json(
      { error: "Failed to synchronize playlist" },
      { status: 500 }
    );
  }
}