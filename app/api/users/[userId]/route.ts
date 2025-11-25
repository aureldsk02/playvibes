import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, sharedPlaylists, playlistLikes, savedPlaylists } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Fetch user profile
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate statistics
    // Get all shared playlists by this user
    const userPlaylists = await db
      .select({ id: sharedPlaylists.id })
      .from(sharedPlaylists)
      .where(
        and(
          eq(sharedPlaylists.userId, userId),
          eq(sharedPlaylists.isPublic, true)
        )
      );

    const playlistIds = userPlaylists.map((p) => p.id);

    // Count total shared playlists
    const sharedPlaylistsCount = playlistIds.length;

    // Count total likes received across all user's playlists
    let totalLikesReceived = 0;
    if (playlistIds.length > 0) {
      const likesResult = await db
        .select({ count: count() })
        .from(playlistLikes)
        .where(
          playlistIds.length === 1
            ? eq(playlistLikes.playlistId, playlistIds[0])
            : undefined
        );
      
      // If multiple playlists, we need to count likes for each
      if (playlistIds.length > 1) {
        for (const playlistId of playlistIds) {
          const result = await db
            .select({ count: count() })
            .from(playlistLikes)
            .where(eq(playlistLikes.playlistId, playlistId));
          totalLikesReceived += result[0]?.count || 0;
        }
      } else {
        totalLikesReceived = likesResult[0]?.count || 0;
      }
    }

    // Count total saves received across all user's playlists
    let totalSavesReceived = 0;
    if (playlistIds.length > 0) {
      if (playlistIds.length > 1) {
        for (const playlistId of playlistIds) {
          const result = await db
            .select({ count: count() })
            .from(savedPlaylists)
            .where(eq(savedPlaylists.playlistId, playlistId));
          totalSavesReceived += result[0]?.count || 0;
        }
      } else {
        const savesResult = await db
          .select({ count: count() })
          .from(savedPlaylists)
          .where(eq(savedPlaylists.playlistId, playlistIds[0]));
        totalSavesReceived = savesResult[0]?.count || 0;
      }
    }

    // Return user profile with stats
    // Only show email if viewing own profile
    const isOwnProfile = session?.user?.id === userId;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        email: isOwnProfile ? user.email : undefined,
        spotifyId: user.spotifyId,
      },
      stats: {
        sharedPlaylistsCount,
        totalLikesReceived,
        totalSavesReceived,
      },
      isOwnProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
