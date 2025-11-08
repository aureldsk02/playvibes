# Quick Start Guide

Get PlayVibes up and running in 5 minutes!

## 1. Prerequisites Check

Ensure you have:
- ✅ Node.js v14+ installed (`node --version`)
- ✅ MongoDB installed and running (`mongod --version`)
- ✅ A Spotify account (free tier works)

## 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/aureldsk02/playvibes.git
cd playvibes

# Install dependencies
npm install
npm run install-client
```

## 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# You need: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
```

### Getting Spotify Credentials (2 minutes)

1. Go to https://developer.spotify.com/dashboard
2. Click "Create an App"
3. Give it any name (e.g., "PlayVibes Dev")
4. Copy the **Client ID** and **Client Secret**
5. Paste them into your `.env` file

## 4. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or update MONGODB_URI in .env to use MongoDB Atlas
```

## 5. Seed Sample Data (Optional)

```bash
npm run seed
```

This adds 5 sample playlists so you can see the app in action immediately.

## 6. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## 7. Open and Explore

🎉 Open your browser to **http://localhost:3000**

### What to try:

1. **Browse playlists** on the home page
2. **Use filters** to find playlists by style, mood, or context
3. **Click a playlist** to see details and play music
4. **Share a playlist**:
   - Click "Share Playlist"
   - Paste any Spotify playlist URL
   - Fill in the details
   - Submit!

## Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running: `mongod`
- Check your MONGODB_URI in `.env`

### "Spotify API Error"
- Verify your credentials in `.env`
- Make sure you copied them correctly from Spotify Dashboard

### Port already in use
- Change PORT in `.env` (default is 5000)
- Or stop the process using that port

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API.md](API.md) for API documentation
- See [TESTING.md](TESTING.md) for testing instructions

## Need Help?

Open an issue on GitHub if you encounter any problems!

---

**Pro Tip**: Keep both terminals open while developing. Changes to the backend will auto-reload with nodemon, and the frontend will hot-reload with Vite! 🔥
