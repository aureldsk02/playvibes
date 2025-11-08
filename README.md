# PlayVibes 🎵

A modern web platform where users can share and discover Spotify playlists with rich metadata including title, description, style, mood, and context.

## Features

- 🎵 **Share Playlists**: Share your Spotify playlists with title, description, style, mood, and context
- 🔍 **Discover**: Browse and filter playlists by genre, mood, activity, country, or influencer
- 🎧 **Listen Directly**: Play playlists directly via embedded Spotify player
- 🌍 **Global Community**: Connect with music lovers worldwide
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Spotify Web API** integration
- RESTful API architecture

### Frontend
- **React** with React Router
- **Vite** for fast development and building
- Modern CSS with custom properties
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Spotify Developer Account (for API credentials)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aureldsk02/playvibes.git
cd playvibes
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
npm run install-client
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/playvibes
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

#### Getting Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details
5. Copy the Client ID and Client Secret to your `.env` file

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### 5. Run the Application

#### Development Mode (with hot reload)

```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend dev server
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Mode

```bash
# Build the client
cd client && npm run build

# Start the server
npm start
```

## API Endpoints

### Playlists

- `GET /api/playlists` - Get all playlists (with optional filters)
  - Query params: `style`, `mood`, `context`, `country`, `influencer`
- `GET /api/playlists/:id` - Get single playlist
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `GET /api/playlists/filters/options` - Get available filter options

### Spotify Integration

- `GET /api/spotify/playlist/:id` - Get Spotify playlist details
- `GET /api/spotify/search?q=query` - Search Spotify playlists

## Usage

### Sharing a Playlist

1. Click "Share Playlist" in the navigation
2. Paste your Spotify playlist URL
3. The app will auto-fetch playlist details
4. Fill in metadata:
   - Title (auto-filled from Spotify)
   - Description
   - Style/Genre (e.g., "Electronic", "Hip-Hop")
   - Mood (e.g., "Chill", "Energetic")
   - Context (e.g., "Working", "Studying")
   - Optional: Country, Influencer
5. Submit to share with the community

### Discovering Playlists

1. Browse the home page to see all shared playlists
2. Use filters to find playlists by:
   - Style/Genre
   - Mood
   - Context/Activity
   - Country
   - Influencer
3. Click on a playlist to:
   - View full details
   - Listen via embedded Spotify player
   - Open in Spotify app

## Project Structure

```
playvibes/
├── server/
│   ├── models/
│   │   └── Playlist.js         # Mongoose playlist schema
│   ├── routes/
│   │   ├── playlists.js        # Playlist CRUD routes
│   │   └── spotify.js          # Spotify API integration
│   └── index.js                # Express server setup
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── PlaylistCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── SpotifyPlayer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SharePlaylist.jsx
│   │   │   └── PlaylistDetail.jsx
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── styles/
│   │   │   └── index.css       # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Data Model

### Playlist Schema

```javascript
{
  title: String,           // Playlist title
  description: String,     // Detailed description
  spotifyUrl: String,      // Full Spotify playlist URL
  spotifyId: String,       // Spotify playlist ID
  style: String,           // Genre/Style
  mood: String,            // Mood/Vibe
  context: String,         // Context/Activity
  country: String,         // Country (optional)
  influencer: String,      // Influencer name (optional)
  createdBy: String,       // Creator name/email
  imageUrl: String,        // Playlist cover image
  trackCount: Number,      // Number of tracks
  timestamps: true         // createdAt, updatedAt
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] User authentication and profiles
- [ ] Like and favorite playlists
- [ ] Comments and ratings
- [ ] Social sharing features
- [ ] Advanced search with full-text search
- [ ] Playlist recommendations based on preferences
- [ ] Mobile app (React Native)

---

Built with ❤️ by the PlayVibes team
