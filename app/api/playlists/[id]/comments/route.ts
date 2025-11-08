import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { playlistComments, sharedPlaylists, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // Get comments with user information
    const comments = await db
      .select({
        id: playlistComments.id,
        playlistId: playlistComments.playlistId,
        userId: playlistComments.userId,
        content: playlistComments.content,
        createdAt: playlistComments.createdAt,
        updatedAt: playlistComments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(playlistComments)
      .innerJoin(users, eq(playlistComments.userId, users.id))
      .where(eq(playlistComments.playlistId, playlistId))
      .orderBy(desc(playlistComments.createdAt));

    return NextResponse.json({
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment content must be less than 1000 characters" },
        { status: 400 }
      );
    }

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

    // Create comment
    const newComment = await db
      .insert(playlistComments)
      .values({
        id: nanoid(),
        playlistId,
        userId: session.user.id,
        content: content.trim(),
      })
      .returning();

    // Get comment with user information
    const commentWithUser = await db
      .select({
        id: playlistComments.id,
        playlistId: playlistComments.playlistId,
        userId: playlistComments.userId,
        content: playlistComments.content,
        createdAt: playlistComments.createdAt,
        updatedAt: playlistComments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(playlistComments)
      .innerJoin(users, eq(playlistComments.userId, users.id))
      .where(eq(playlistComments.id, newComment[0].id))
      .limit(1);

    return NextResponse.json({
      message: "Comment added successfully",
      data: commentWithUser[0],
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}