import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
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

    // Get user's shared playlists
    const userSharedPlaylists = await db
      .select({
        id: sharedPlaylists.id,
        spotifyPlaylistId: sharedPlaylists.spotifyPlaylistId,
        name: sharedPlaylists.name,
        description: sharedPlaylists.description,
        imageUrl: sharedPlaylists.imageUrl,
        trackCount: sharedPlaylists.trackCount,
        genres: sharedPlaylists.genres,
        moods: sharedPlaylists.moods,
        activities: sharedPlaylists.activities,
        isPublic: sharedPlaylists.isPublic,
        createdAt: sharedPlaylists.createdAt,
        updatedAt: sharedPlaylists.updatedAt,
      })
      .from(sharedPlaylists)
      .where(eq(sharedPlaylists.userId, session.user.id));

    return NextResponse.json({
      playlists: userSharedPlaylists,
    });
  } catch (error) {
    console.error("Error fetching shared playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared playlists" },
      { status: 500 }
    );
  }
}