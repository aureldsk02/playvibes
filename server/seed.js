require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('./models/Playlist');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/playvibes';

const samplePlaylists = [
  {
    title: "Focus Deep Work",
    description: "Perfect playlist for deep concentration and productivity. Instrumental tracks that help you stay in the zone.",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
    spotifyId: "37i9dQZF1DWZeKCadgRdKQ",
    style: "Electronic",
    mood: "Focused",
    context: "Working",
    country: "USA",
    influencer: "Spotify",
    createdBy: "admin@playvibes.com",
    imageUrl: "",
    trackCount: 50
  },
  {
    title: "Afro Chill Night",
    description: "Smooth Afrobeat vibes for a relaxing evening. Perfect for unwinding after a long day.",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX4YfQbNFqBrs",
    spotifyId: "37i9dQZF1DX4YfQbNFqBrs",
    style: "Afrobeat",
    mood: "Chill",
    context: "Night",
    country: "Nigeria",
    influencer: "Burna Boy",
    createdBy: "admin@playvibes.com",
    imageUrl: "",
    trackCount: 45
  },
  {
    title: "Rainy Day Coding",
    description: "Lo-fi beats and chill music perfect for coding on a rainy day. Stay productive and relaxed.",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn",
    spotifyId: "37i9dQZF1DWWQRwui0ExPn",
    style: "Lo-fi",
    mood: "Relaxed",
    context: "Coding",
    country: "Japan",
    influencer: "",
    createdBy: "developer@example.com",
    imageUrl: "",
    trackCount: 60
  },
  {
    title: "Workout Energy Boost",
    description: "High-energy tracks to power through your workout. Get motivated and crush your fitness goals!",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP",
    spotifyId: "37i9dQZF1DX76Wlfdnj7AP",
    style: "Hip-Hop",
    mood: "Energetic",
    context: "Workout",
    country: "",
    influencer: "",
    createdBy: "fitness@example.com",
    imageUrl: "",
    trackCount: 40
  },
  {
    title: "Sunday Jazz Brunch",
    description: "Smooth jazz classics for a relaxing Sunday brunch. Elegant and sophisticated vibes.",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt",
    spotifyId: "37i9dQZF1DXbITWG1ZJKYt",
    style: "Jazz",
    mood: "Relaxed",
    context: "Dining",
    country: "France",
    influencer: "",
    createdBy: "music@example.com",
    imageUrl: "",
    trackCount: 35
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing playlists
    await Playlist.deleteMany({});
    console.log('Cleared existing playlists');

    // Insert sample playlists
    await Playlist.insertMany(samplePlaylists);
    console.log(`Inserted ${samplePlaylists.length} sample playlists`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
