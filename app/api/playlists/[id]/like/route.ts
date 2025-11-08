import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { playlistLikes, sharedPlaylists } from "@/lib/db/schema";
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

    // Check if user already liked this playlist
    const existingLike = await db
      .select()
      .from(playlistLikes)
      .where(
        and(
          eq(playlistLikes.playlistId, playlistId),
          eq(playlistLikes.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json(
        { error: "Playlist already liked" },
        { status: 400 }
      );
    }

    // Add like
    await db.insert(playlistLikes).values({
      id: nanoid(),
      playlistId,
      userId: session.user.id,
    });

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(playlistLikes)
      .where(eq(playlistLikes.playlistId, playlistId));

    const likesCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({
      message: "Playlist liked successfully",
      likesCount,
      isLiked: true,
    });
  } catch (error) {
    console.error("Error liking playlist:", error);
    return NextResponse.json(
      { error: "Failed to like playlist" },
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

    // Check if user has liked this playlist
    const existingLike = await db
      .select()
      .from(playlistLikes)
      .where(
        and(
          eq(playlistLikes.playlistId, playlistId),
          eq(playlistLikes.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingLike.length === 0) {
      return NextResponse.json(
        { error: "Playlist not liked" },
        { status: 400 }
      );
    }

    // Remove like
    await db
      .delete(playlistLikes)
      .where(
        and(
          eq(playlistLikes.playlistId, playlistId),
          eq(playlistLikes.userId, session.user.id)
        )
      );

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(playlistLikes)
      .where(eq(playlistLikes.playlistId, playlistId));

    const likesCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({
      message: "Playlist unliked successfully",
      likesCount,
      isLiked: false,
    });
  } catch (error) {
    console.error("Error unliking playlist:", error);
    return NextResponse.json(
      { error: "Failed to unlike playlist" },
      { status: 500 }
    );
  }
}