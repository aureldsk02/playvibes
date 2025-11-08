# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
Currently, the API does not require authentication. Future versions will implement user authentication.

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP address
- **Response**: `429 Too Many Requests` when limit exceeded

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response**
```json
{
  "status": "ok",
  "message": "PlayVibes API is running"
}
```

---

### Playlists

#### GET /playlists
Get all playlists with optional filtering.

**Query Parameters**
- `style` (string, optional): Filter by music style/genre
- `mood` (string, optional): Filter by mood
- `context` (string, optional): Filter by context/activity
- `country` (string, optional): Filter by country
- `influencer` (string, optional): Filter by influencer

**Example Request**
```bash
GET /api/playlists?style=Electronic&mood=Focused
```

**Response**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Focus Deep Work",
    "description": "Perfect playlist for deep concentration",
    "spotifyUrl": "https://open.spotify.com/playlist/...",
    "spotifyId": "37i9dQZF1DWZeKCadgRdKQ",
    "style": "Electronic",
    "mood": "Focused",
    "context": "Working",
    "country": "USA",
    "influencer": "Spotify",
    "createdBy": "admin@playvibes.com",
    "imageUrl": "https://...",
    "trackCount": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /playlists/:id
Get a single playlist by ID.

**Parameters**
- `id` (string, required): MongoDB ObjectId of the playlist

**Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Focus Deep Work",
  "description": "Perfect playlist for deep concentration",
  ...
}
```

**Error Response**
```json
{
  "message": "Playlist not found"
}
```

#### POST /playlists
Create a new playlist.

**Request Body**
```json
{
  "title": "My Playlist",
  "description": "A great playlist for...",
  "spotifyUrl": "https://open.spotify.com/playlist/...",
  "spotifyId": "37i9dQZF1DWZeKCadgRdKQ",
  "style": "Electronic",
  "mood": "Energetic",
  "context": "Workout",
  "country": "USA",
  "influencer": "DJ Name",
  "createdBy": "user@example.com",
  "imageUrl": "https://...",
  "trackCount": 30
}
```

**Required Fields**
- `title`
- `description`
- `spotifyUrl`
- `spotifyId`
- `style`
- `mood`
- `context`
- `createdBy`

**Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "My Playlist",
  ...
}
```

#### PUT /playlists/:id
Update an existing playlist.

**Parameters**
- `id` (string, required): MongoDB ObjectId of the playlist

**Request Body**
Any fields from the playlist schema can be updated.

**Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  ...
}
```

#### DELETE /playlists/:id
Delete a playlist.

**Parameters**
- `id` (string, required): MongoDB ObjectId of the playlist

**Response**
```json
{
  "message": "Playlist deleted"
}
```

#### GET /playlists/filters/options
Get all available filter options based on existing playlists.

**Response**
```json
{
  "styles": ["Electronic", "Hip-Hop", "Jazz", "Lo-fi"],
  "moods": ["Focused", "Chill", "Energetic", "Relaxed"],
  "contexts": ["Working", "Workout", "Night", "Coding"],
  "countries": ["USA", "Nigeria", "Japan", "France"],
  "influencers": ["Spotify", "Burna Boy", "DJ Snake"]
}
```

---

### Spotify Integration

#### GET /spotify/playlist/:id
Get detailed information about a Spotify playlist.

**Parameters**
- `id` (string, required): Spotify playlist ID (alphanumeric only)

**Example Request**
```bash
GET /api/spotify/playlist/37i9dQZF1DWZeKCadgRdKQ
```

**Response**
```json
{
  "id": "37i9dQZF1DWZeKCadgRdKQ",
  "name": "Deep Focus",
  "description": "Keep calm and focus...",
  "images": [
    {
      "url": "https://...",
      "height": 640,
      "width": 640
    }
  ],
  "tracks": {
    "total": 50,
    "items": [...]
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/playlist/..."
  }
}
```

**Error Responses**
- `400 Bad Request`: Invalid playlist ID format
- `404 Not Found`: Playlist not found on Spotify
- `500 Internal Server Error`: Spotify API error

#### GET /spotify/search
Search for playlists on Spotify.

**Query Parameters**
- `q` (string, required): Search query (max 200 characters)

**Example Request**
```bash
GET /api/spotify/search?q=chill+vibes
```

**Response**
```json
{
  "playlists": {
    "items": [
      {
        "id": "37i9dQZF1DWZeKCadgRdKQ",
        "name": "Chill Vibes",
        "description": "...",
        "images": [...],
        "tracks": { "total": 50 },
        "external_urls": { ... }
      }
    ]
  }
}
```

**Error Responses**
- `400 Bad Request`: Missing or invalid query parameter
- `500 Internal Server Error`: Spotify API error

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses follow this format:
```json
{
  "message": "Error description"
}
```

## Security

### NoSQL Injection Prevention
All user input is sanitized using `express-mongo-sanitize` to prevent NoSQL injection attacks.

### Rate Limiting
API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address

### Input Validation
- Spotify playlist IDs are validated to be alphanumeric only
- Search queries are limited to 200 characters
- MongoDB queries are sanitized

## Data Models

### Playlist Schema
```javascript
{
  title: String (required),
  description: String (required),
  spotifyUrl: String (required),
  spotifyId: String (required),
  style: String (required),
  mood: String (required),
  context: String (required),
  country: String (optional),
  influencer: String (optional),
  createdBy: String (required),
  imageUrl: String (optional),
  trackCount: Number (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Examples

### JavaScript (Fetch API)
```javascript
// Get all playlists
const response = await fetch('http://localhost:5000/api/playlists');
const playlists = await response.json();

// Create a playlist
const response = await fetch('http://localhost:5000/api/playlists', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Playlist',
    description: 'Description',
    spotifyUrl: 'https://open.spotify.com/playlist/...',
    spotifyId: '37i9dQZF1DWZeKCadgRdKQ',
    style: 'Electronic',
    mood: 'Energetic',
    context: 'Workout',
    createdBy: 'user@example.com'
  })
});
const newPlaylist = await response.json();
```

### Python (requests)
```python
import requests

# Get filtered playlists
response = requests.get('http://localhost:5000/api/playlists', params={
    'style': 'Electronic',
    'mood': 'Focused'
})
playlists = response.json()

# Create a playlist
response = requests.post('http://localhost:5000/api/playlists', json={
    'title': 'My Playlist',
    'description': 'Description',
    'spotifyUrl': 'https://open.spotify.com/playlist/...',
    'spotifyId': '37i9dQZF1DWZeKCadgRdKQ',
    'style': 'Electronic',
    'mood': 'Energetic',
    'context': 'Workout',
    'createdBy': 'user@example.com'
})
new_playlist = response.json()
```

## Support
For issues or questions about the API, please open an issue on GitHub.
