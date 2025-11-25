import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sharedPlaylists, users, playlistLikes, savedPlaylists } from "@/lib/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Get current session to check if user is viewing their own profile
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const isOwnProfile = session?.user?.id === userId;

    // Build query conditions
    const conditions = [eq(sharedPlaylists.userId, userId)];
    
    // Only show public playlists if not viewing own profile
    if (!isOwnProfile) {
      conditions.push(eq(sharedPlaylists.isPublic, true));
    }

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(sharedPlaylists)
      .where(and(...conditions));

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Fetch playlists with user info and counts
    const playlistsData = await db
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
        userId: sharedPlaylists.userId,
        userName: users.name,
        userImage: users.image,
        userEmail: users.email,
      })
      .from(sharedPlaylists)
      .leftJoin(users, eq(sharedPlaylists.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(sharedPlaylists.createdAt))
      .limit(limit)
      .offset(offset);

    // Get likes and saves counts for each playlist
    const playlistsWithCounts = await Promise.all(
      playlistsData.map(async (playlist) => {
        // Get likes count
        const likesResult = await db
          .select({ count: count() })
          .from(playlistLikes)
          .where(eq(playlistLikes.playlistId, playlist.id));

        const likesCount = likesResult[0]?.count || 0;

        // Get saves count
        const savesResult = await db
          .select({ count: count() })
          .from(savedPlaylists)
          .where(eq(savedPlaylists.playlistId, playlist.id));

        const savesCount = savesResult[0]?.count || 0;

        // Check if current user liked/saved this playlist
        let isLiked = false;
        let isSaved = false;

        if (session?.user?.id) {
          const likeCheck = await db
            .select()
            .from(playlistLikes)
            .where(
              and(
                eq(playlistLikes.playlistId, playlist.id),
                eq(playlistLikes.userId, session.user.id)
              )
            )
            .limit(1);

          isLiked = likeCheck.length > 0;

          const saveCheck = await db
            .select()
            .from(savedPlaylists)
            .where(
              and(
                eq(savedPlaylists.playlistId, playlist.id),
                eq(savedPlaylists.userId, session.user.id)
              )
            )
            .limit(1);

          isSaved = saveCheck.length > 0;
        }

        return {
          ...playlist,
          user: {
            id: playlist.userId,
            name: playlist.userName,
            image: playlist.userImage,
            email: playlist.userEmail,
          },
          likesCount,
          savesCount,
          commentsCount: 0, // We can add this later if needed
          isLiked,
          isSaved,
        };
      })
    );

    return NextResponse.json({
      data: playlistsWithCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch user playlists" },
      { status: 500 }
    );
  }
}
