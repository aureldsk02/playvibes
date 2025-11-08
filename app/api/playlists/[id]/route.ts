import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sharedPlaylists, users, playlistLikes, playlistComments, savedPlaylists } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playlistId } = await params;
    
    // Get current user session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Get playlist with user details and counts
    const playlistQuery = db
      .select({
        id: sharedPlaylists.id,
        spotifyPlaylistId: sharedPlaylists.spotifyPlaylistId,
        userId: sharedPlaylists.userId,
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
        userName: users.name,
        userImage: users.image,
        userEmail: users.email,
      })
      .from(sharedPlaylists)
      .leftJoin(users, eq(sharedPlaylists.userId, users.id))
      .where(eq(sharedPlaylists.id, playlistId))
      .limit(1);

    const [playlist] = await playlistQuery;

    if (!playlist) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Check if playlist is public or user owns it
    if (!playlist.isPublic && playlist.userId !== session?.user?.id) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Get likes count
    const [likesResult] = await db
      .select({ count: count() })
      .from(playlistLikes)
      .where(eq(playlistLikes.playlistId, playlistId));

    // Get comments count
    const [commentsResult] = await db
      .select({ count: count() })
      .from(playlistComments)
      .where(eq(playlistComments.playlistId, playlistId));

    // Check if current user liked this playlist
    let isLiked = false;
    if (session?.user?.id) {
      const [likeResult] = await db
        .select()
        .from(playlistLikes)
        .where(
          eq(playlistLikes.playlistId, playlistId) &&
          eq(playlistLikes.userId, session.user.id)
        )
        .limit(1);
      
      isLiked = !!likeResult;
    }

    // Check if current user saved this playlist
    let isSaved = false;
    if (session?.user?.id) {
      const [saveResult] = await db
        .select()
        .from(savedPlaylists)
        .where(
          eq(savedPlaylists.playlistId, playlistId) &&
          eq(savedPlaylists.userId, session.user.id)
        )
        .limit(1);
      
      isSaved = !!saveResult;
    }

    // Format response
    const response = {
      id: playlist.id,
      spotifyPlaylistId: playlist.spotifyPlaylistId,
      userId: playlist.userId,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.imageUrl,
      trackCount: playlist.trackCount,
      genres: playlist.genres || [],
      moods: playlist.moods || [],
      activities: playlist.activities || [],
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      user: {
        id: playlist.userId,
        name: playlist.userName,
        image: playlist.userImage,
        email: playlist.userEmail,
      },
      likesCount: likesResult?.count || 0,
      commentsCount: commentsResult?.count || 0,
      isLiked,
      isSaved,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}