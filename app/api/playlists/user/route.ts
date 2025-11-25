import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
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

    // Get user's Spotify ID
    const user = await db
      .select({ spotifyId: users.spotifyId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const spotifyId = user[0]?.spotifyId;

    // Get valid access token
    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Spotify connection required" },
        { status: 401 }
      );
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch user's playlists from Spotify
    const playlistsData = await spotifyAPI.getUserPlaylists(accessToken, limit, offset);

    // Transform Spotify playlist data to our format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playlists = playlistsData.items.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images?.[0]?.url,
      trackCount: playlist.tracks.total,
      isPublic: playlist.public,
      isOwner: playlist.owner.id === spotifyId,
      owner: {
        id: playlist.owner.id,
        displayName: playlist.owner.display_name,
      },
    }));

    return NextResponse.json({
      playlists,
      pagination: {
        total: playlistsData.total,
        limit: playlistsData.limit,
        offset: playlistsData.offset,
        hasNext: playlistsData.next !== null,
        hasPrevious: playlistsData.previous !== null,
      },
    });
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}