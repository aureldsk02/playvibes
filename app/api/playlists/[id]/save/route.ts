import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { savedPlaylists, sharedPlaylists } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: playlistId } = await params;

    // Check if playlist exists
    const playlist = await db
      .select()
      .from(sharedPlaylists)
      .where(eq(sharedPlaylists.id, playlistId))
      .limit(1);

    if (playlist.length === 0) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    // Check if user already saved this playlist
    const existingSave = await db
      .select()
      .from(savedPlaylists)
      .where(
        and(
          eq(savedPlaylists.playlistId, playlistId),
          eq(savedPlaylists.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingSave.length > 0) {
      return NextResponse.json(
        { error: "Playlist already saved" },
        { status: 400 }
      );
    }

    // Add save
    await db.insert(savedPlaylists).values({
      playlistId,
      userId: session.user.id,
    });

    // Get updated save count
    const saveCountResult = await db
      .select({ count: count() })
      .from(savedPlaylists)
      .where(eq(savedPlaylists.playlistId, playlistId));

    const savesCount = saveCountResult[0]?.count || 0;

    return NextResponse.json({
      message: "Playlist saved successfully",
      savesCount,
      isSaved: true,
    });
  } catch (error) {
    console.error("Error saving playlist:", error);
    return NextResponse.json(
      { error: "Failed to save playlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: playlistId } = await params;

    // Check if user has saved this playlist
    const existingSave = await db
      .select()
      .from(savedPlaylists)
      .where(
        and(
          eq(savedPlaylists.playlistId, playlistId),
          eq(savedPlaylists.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingSave.length === 0) {
      return NextResponse.json(
        { error: "Playlist not saved" },
        { status: 400 }
      );
    }

    // Remove save
    await db
      .delete(savedPlaylists)
      .where(
        and(
          eq(savedPlaylists.playlistId, playlistId),
          eq(savedPlaylists.userId, session.user.id)
        )
      );

    // Get updated save count
    const saveCountResult = await db
      .select({ count: count() })
      .from(savedPlaylists)
      .where(eq(savedPlaylists.playlistId, playlistId));

    const savesCount = saveCountResult[0]?.count || 0;

    return NextResponse.json({
      message: "Playlist unsaved successfully",
      savesCount,
      isSaved: false,
    });
  } catch (error) {
    console.error("Error unsaving playlist:", error);
    return NextResponse.json(
      { error: "Failed to unsave playlist" },
      { status: 500 }
    );
  }
}