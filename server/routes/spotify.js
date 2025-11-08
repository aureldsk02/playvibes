const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get Spotify access token
let spotifyToken = null;
let tokenExpiry = null;

async function getSpotifyToken() {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        }
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response?.data || error.message);
    throw error;
  }
}

// Get playlist details from Spotify
router.get('/playlist/:id', async (req, res) => {
  try {
    // Validate playlist ID format (alphanumeric)
    const playlistId = req.params.id;
    if (!/^[a-zA-Z0-9]+$/.test(playlistId)) {
      return res.status(400).json({ message: 'Invalid playlist ID format' });
    }

    const token = await getSpotifyToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || error.message 
    });
  }
});

// Search Spotify playlists
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    // Validate and sanitize search query
    const sanitizedQuery = String(q).trim();
    if (sanitizedQuery.length > 200) {
      return res.status(400).json({ message: 'Search query too long' });
    }

    const token = await getSpotifyToken();
    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        params: {
          q: sanitizedQuery,
          type: 'playlist',
          limit: 20
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.error?.message || error.message 
    });
  }
});

module.exports = router;
