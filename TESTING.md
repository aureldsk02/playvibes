# Testing PlayVibes Platform

## Manual Testing Guide

### Prerequisites
1. MongoDB running (local or Atlas)
2. Spotify API credentials configured in `.env`
3. Backend and frontend running

### Test Scenarios

#### 1. Backend API Testing

**Health Check**
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","message":"PlayVibes API is running"}
```

**Get All Playlists**
```bash
curl http://localhost:5000/api/playlists
# Expected: Array of playlist objects
```

**Filter Playlists**
```bash
# Filter by style
curl "http://localhost:5000/api/playlists?style=Electronic"

# Filter by mood
curl "http://localhost:5000/api/playlists?mood=Chill"

# Filter by context
curl "http://localhost:5000/api/playlists?context=Working"

# Multiple filters
curl "http://localhost:5000/api/playlists?style=Electronic&mood=Focused"
```

**Create Playlist**
```bash
curl -X POST http://localhost:5000/api/playlists \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Playlist",
    "description": "A test playlist",
    "spotifyUrl": "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
    "spotifyId": "37i9dQZF1DWZeKCadgRdKQ",
    "style": "Test",
    "mood": "Happy",
    "context": "Testing",
    "createdBy": "test@example.com"
  }'
```

**Get Filter Options**
```bash
curl http://localhost:5000/api/playlists/filters/options
# Expected: Object with arrays of available filter values
```

**Spotify API Integration**
```bash
# Get Spotify playlist details
curl http://localhost:5000/api/spotify/playlist/37i9dQZF1DWZeKCadgRdKQ

# Search Spotify playlists
curl "http://localhost:5000/api/spotify/search?q=chill"
```

#### 2. Frontend Testing

Open http://localhost:3000 in your browser

**Home Page (Discovery)**
- [ ] Verify playlists are displayed
- [ ] Check that playlist cards show title, description, and tags
- [ ] Test filter functionality:
  - [ ] Filter by style
  - [ ] Filter by mood
  - [ ] Filter by context
  - [ ] Filter by country
  - [ ] Filter by influencer
  - [ ] Clear filters button works
- [ ] Click "View & Play" button navigates to detail page
- [ ] Click "Open in Spotify" opens Spotify

**Share Playlist Page**
- [ ] Navigate to /share
- [ ] Paste a Spotify playlist URL
- [ ] Verify auto-fetch of playlist details
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] Verify redirect to home page
- [ ] Verify new playlist appears in list

**Playlist Detail Page**
- [ ] Click on a playlist from home page
- [ ] Verify all metadata is displayed
- [ ] Check embedded Spotify player works
- [ ] Test "Open in Spotify" button
- [ ] Test "Back to Discover" button

**Responsive Design**
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify layout adapts correctly

#### 3. Security Testing

**Rate Limiting**
```bash
# Send multiple requests quickly
for i in {1..110}; do curl http://localhost:5000/api/playlists; done
# Expected: After 100 requests, should get rate limit error
```

**NoSQL Injection Prevention**
```bash
# Try to inject NoSQL query
curl "http://localhost:5000/api/playlists?style[\$ne]=test"
# Expected: Sanitized, no injection occurs
```

**Input Validation**
```bash
# Invalid Spotify ID
curl http://localhost:5000/api/spotify/playlist/invalid-id-with-special-chars!
# Expected: 400 Bad Request

# Empty search query
curl "http://localhost:5000/api/spotify/search?q="
# Expected: 400 Bad Request

# Very long search query
curl "http://localhost:5000/api/spotify/search?q=$(python3 -c 'print("a"*300)')"
# Expected: 400 Bad Request
```

### Seeding Test Data

To populate the database with sample playlists:

```bash
npm run seed
```

This will create 5 sample playlists with diverse metadata for testing filters and discovery features.

### Expected Results

✅ All API endpoints respond with correct status codes
✅ Filtering works correctly with all combinations
✅ Spotify integration fetches real playlist data
✅ Rate limiting prevents abuse
✅ Input validation blocks malicious input
✅ Frontend displays data correctly
✅ Embedded Spotify player works
✅ Responsive design works on all screen sizes

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

**Spotify API Error**
- Verify SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are correct
- Check if credentials are valid on Spotify Developer Dashboard

**CORS Issues**
- Backend and frontend must run on different ports (5000 and 3000)
- Vite proxy configuration handles API calls

### Performance Testing

**Load Testing** (optional, requires `ab` or `wrk`)
```bash
# Test API performance
ab -n 1000 -c 10 http://localhost:5000/api/playlists

# Expected: Handle 1000 requests with 10 concurrent connections
```

## Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Playwright or Cypress
- API tests with Postman/Newman
