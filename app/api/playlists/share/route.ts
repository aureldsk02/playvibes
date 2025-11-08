import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";
import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

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
    const { spotifyPlaylistId, isPublic } = body;

    if (!spotifyPlaylistId || typeof isPublic !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: spotifyPlaylistId, isPublic" },
        { status: 400 }
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

    // Fetch playlist details from Spotify to ensure it exists and user has access
    const response = await spotifyAPI.makeSpotifyRequest(
      `/playlists/${spotifyPlaylistId}`,
      accessToken
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Playlist not found or access denied" },
        { status: 404 }
      );
    }

    const spotifyPlaylist = await response.json();

    // Check if playlist is already shared
    const existingSharedPlaylist = await db
      .select()
      .from(sharedPlaylists)
      .where(
        and(
          eq(sharedPlaylists.spotifyPlaylistId, spotifyPlaylistId),
          eq(sharedPlaylists.userId, session.user.id)
        )
      )
      .limit(1);

    if (isPublic) {
      // Share the playlist
      if (existingSharedPlaylist.length > 0) {
        // Update existing shared playlist
        const updated = await db
          .update(sharedPlaylists)
          .set({
            isPublic: true,
            name: spotifyPlaylist.name,
            description: spotifyPlaylist.description,
            imageUrl: spotifyPlaylist.images?.[0]?.url,
            trackCount: spotifyPlaylist.tracks.total,
            updatedAt: new Date(),
          })
          .where(eq(sharedPlaylists.id, existingSharedPlaylist[0].id))
          .returning();

        return NextResponse.json({
          message: "Playlist updated successfully",
          playlist: updated[0],
        });
      } else {
        // Create new shared playlist
        const newSharedPlaylist = await db
          .insert(sharedPlaylists)
          .values({
            id: nanoid(),
            spotifyPlaylistId,
            userId: session.user.id,
            name: spotifyPlaylist.name,
            description: spotifyPlaylist.description,
            imageUrl: spotifyPlaylist.images?.[0]?.url,
            trackCount: spotifyPlaylist.tracks.total,
            genres: [], // Will be populated later with metadata sync
            moods: [],
            activities: [],
            isPublic: true,
          })
          .returning();

        return NextResponse.json({
          message: "Playlist shared successfully",
          playlist: newSharedPlaylist[0],
        });
      }
    } else {
      // Unshare the playlist
      if (existingSharedPlaylist.length > 0) {
        await db
          .update(sharedPlaylists)
          .set({
            isPublic: false,
            updatedAt: new Date(),
          })
          .where(eq(sharedPlaylists.id, existingSharedPlaylist[0].id));

        return NextResponse.json({
          message: "Playlist unshared successfully",
        });
      } else {
        return NextResponse.json({
          message: "Playlist was not shared",
        });
      }
    }
  } catch (error) {
    console.error("Error sharing/unsharing playlist:", error);
    return NextResponse.json(
      { error: "Failed to update playlist sharing status" },
      { status: 500 }
    );
  }
}