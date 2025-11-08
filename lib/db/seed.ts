import { db } from './index';
import { users, sharedPlaylists, playlistLikes, playlistComments, savedPlaylists } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create sample users
    const sampleUsers = [
      {
        id: 'user_1',
        email: 'alice@example.com',
        name: 'Alice Johnson',
        spotifyId: 'alice_spotify',
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: 'user_2',
        email: 'bob@example.com',
        name: 'Bob Smith',
        spotifyId: 'bob_spotify',
        image: 'https://i.pravatar.cc/150?img=2',
      },
      {
        id: 'user_3',
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        spotifyId: 'charlie_spotify',
        image: 'https://i.pravatar.cc/150?img=3',
      },
    ];

    console.log('Creating sample users...');
    for (const user of sampleUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }

    // Create sample playlists
    const samplePlaylists = [
      {
        id: 'playlist_1',
        spotifyPlaylistId: 'spotify_playlist_1',
        userId: 'user_1',
        name: 'Chill Vibes',
        description: 'Perfect for relaxing after a long day',
        imageUrl: 'https://picsum.photos/300/300?random=1',
        trackCount: 25,
        genres: ['indie', 'electronic', 'ambient'],
        moods: ['chill', 'relaxed', 'peaceful'],
        activities: ['studying', 'working', 'meditation'],
        isPublic: true,
      },
      {
        id: 'playlist_2',
        spotifyPlaylistId: 'spotify_playlist_2',
        userId: 'user_2',
        name: 'Workout Pump',
        description: 'High energy tracks to fuel your workout',
        imageUrl: 'https://picsum.photos/300/300?random=2',
        trackCount: 40,
        genres: ['rock', 'hip-hop', 'electronic'],
        moods: ['energetic', 'motivated', 'intense'],
        activities: ['workout', 'running', 'gym'],
        isPublic: true,
      },
      {
        id: 'playlist_3',
        spotifyPlaylistId: 'spotify_playlist_3',
        userId: 'user_3',
        name: 'Road Trip Classics',
        description: 'The ultimate road trip soundtrack',
        imageUrl: 'https://picsum.photos/300/300?random=3',
        trackCount: 60,
        genres: ['rock', 'pop', 'country'],
        moods: ['upbeat', 'nostalgic', 'fun'],
        activities: ['driving', 'travel', 'party'],
        isPublic: true,
      },
      {
        id: 'playlist_4',
        spotifyPlaylistId: 'spotify_playlist_4',
        userId: 'user_1',
        name: 'Jazz Essentials',
        description: 'A collection of timeless jazz classics',
        imageUrl: 'https://picsum.photos/300/300?random=4',
        trackCount: 35,
        genres: ['jazz', 'blues', 'swing'],
        moods: ['sophisticated', 'smooth', 'classy'],
        activities: ['dinner', 'reading', 'relaxing'],
        isPublic: true,
      },
    ];

    console.log('Creating sample playlists...');
    for (const playlist of samplePlaylists) {
      await db.insert(sharedPlaylists).values(playlist).onConflictDoNothing();
    }

    // Create sample likes
    const sampleLikes = [
      { id: 'like_1', playlistId: 'playlist_1', userId: 'user_2' },
      { id: 'like_2', playlistId: 'playlist_1', userId: 'user_3' },
      { id: 'like_3', playlistId: 'playlist_2', userId: 'user_1' },
      { id: 'like_4', playlistId: 'playlist_2', userId: 'user_3' },
      { id: 'like_5', playlistId: 'playlist_3', userId: 'user_1' },
      { id: 'like_6', playlistId: 'playlist_4', userId: 'user_2' },
    ];

    console.log('Creating sample likes...');
    for (const like of sampleLikes) {
      await db.insert(playlistLikes).values(like).onConflictDoNothing();
    }

    // Create sample comments
    const sampleComments = [
      {
        id: 'comment_1',
        playlistId: 'playlist_1',
        userId: 'user_2',
        content: 'Love this playlist! Perfect for my study sessions.',
      },
      {
        id: 'comment_2',
        playlistId: 'playlist_1',
        userId: 'user_3',
        content: 'Great selection of tracks. Very relaxing!',
      },
      {
        id: 'comment_3',
        playlistId: 'playlist_2',
        userId: 'user_1',
        content: 'This gets me pumped every time! 💪',
      },
      {
        id: 'comment_4',
        playlistId: 'playlist_3',
        userId: 'user_1',
        content: 'Brings back so many memories from our last road trip!',
      },
    ];

    console.log('Creating sample comments...');
    for (const comment of sampleComments) {
      await db.insert(playlistComments).values(comment).onConflictDoNothing();
    }

    // Create sample saved playlists
    const sampleSaves = [
      { id: 'save_1', playlistId: 'playlist_2', userId: 'user_1' },
      { id: 'save_2', playlistId: 'playlist_3', userId: 'user_1' },
      { id: 'save_3', playlistId: 'playlist_1', userId: 'user_2' },
      { id: 'save_4', playlistId: 'playlist_4', userId: 'user_3' },
    ];

    console.log('Creating sample saved playlists...');
    for (const save of sampleSaves) {
      await db.insert(savedPlaylists).values(save).onConflictDoNothing();
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };