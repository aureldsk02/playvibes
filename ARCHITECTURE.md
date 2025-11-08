# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          React Frontend (Vite)                      │   │
│  │  - Home (Discover playlists)                        │   │
│  │  - Share (Create new playlist)                      │   │
│  │  - Detail (View & play playlist)                    │   │
│  │  - Components (Cards, Filters, Player)              │   │
│  └───────────────┬─────────────────────────────────────┘   │
│                  │ HTTP Requests                            │
└──────────────────┼──────────────────────────────────────────┘
                   │
                   │ Port 3000 (Dev) → Proxy to Port 5000
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Express Backend (Node.js)                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Middleware                                          │   │
│  │  - CORS                                              │   │
│  │  - Rate Limiting (100 req/15min)                    │   │
│  │  - Mongo Sanitization (NoSQL injection prevention)  │   │
│  │  - JSON Body Parser                                 │   │
│  └───────────────┬─────────────────────────────────────┘   │
│                  │                                          │
│  ┌───────────────▼───────────────┬─────────────────────┐   │
│  │  Routes                       │                     │   │
│  │  /api/playlists              │  /api/spotify       │   │
│  │  - GET /                     │  - GET /playlist/:id│   │
│  │  - GET /:id                  │  - GET /search      │   │
│  │  - POST /                    │                     │   │
│  │  - PUT /:id                  │                     │   │
│  │  - DELETE /:id               │                     │   │
│  │  - GET /filters/options      │                     │   │
│  └───────────────┬───────────────┴─────────────────────┘   │
└──────────────────┼──────────────────┬───────────────────────┘
                   │                  │
                   │                  │ Spotify Web API
                   │                  │ (OAuth 2.0)
                   │                  │
┌──────────────────▼──────────┐  ┌───▼─────────────────────┐
│     MongoDB Database         │  │   Spotify Platform      │
│                              │  │                         │
│  ┌────────────────────────┐ │  │  - Playlist metadata    │
│  │  Playlist Collection   │ │  │  - Track information    │
│  │  - title               │ │  │  - Images               │
│  │  - description         │ │  │  - Search               │
│  │  - spotifyUrl          │ │  │                         │
│  │  - spotifyId           │ │  └─────────────────────────┘
│  │  - style, mood, context│ │
│  │  - country, influencer │ │
│  │  - createdBy           │ │
│  │  - imageUrl, trackCount│ │
│  │  - timestamps          │ │
│  └────────────────────────┘ │
└──────────────────────────────┘
```

## Data Flow

### 1. Discovering Playlists
```
User → Frontend → GET /api/playlists?filters → Backend → MongoDB → Response
                                                                   ↓
User ← Frontend ← JSON (playlists) ←─────────────────────────────┘
```

### 2. Sharing a Playlist
```
User enters Spotify URL
     ↓
Frontend extracts Spotify ID
     ↓
GET /api/spotify/playlist/:id → Backend → Spotify API
                                             ↓
Frontend ← Auto-fill form data ←─────────────┘
     ↓
User fills remaining details
     ↓
POST /api/playlists → Backend → MongoDB
                                    ↓
Frontend ← Success response ←───────┘
     ↓
Navigate to home page
```

### 3. Playing a Playlist
```
User clicks playlist
     ↓
GET /api/playlists/:id → Backend → MongoDB
                                      ↓
Frontend ← Playlist details ←─────────┘
     ↓
Display playlist info
     ↓
Render Spotify Embed Player
     ↓
User plays music via Spotify Widget
```

## Technology Stack

### Frontend
- **React 19**: UI library
- **React Router 7**: Client-side routing
- **Vite 7**: Build tool and dev server
- **CSS**: Custom styling with CSS variables
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express 5**: Web framework
- **Mongoose 8**: MongoDB ODM
- **express-rate-limit**: Rate limiting middleware
- **express-mongo-sanitize**: NoSQL injection prevention
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

### Database
- **MongoDB**: NoSQL document database
  - Flexible schema for playlist metadata
  - Indexed fields for efficient filtering
  - Timestamps for audit trail

### External Services
- **Spotify Web API**: 
  - Playlist metadata retrieval
  - Search functionality
  - OAuth 2.0 client credentials flow

## Security Features

1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **Input Sanitization**: Prevents NoSQL injection attacks
3. **Input Validation**: 
   - Spotify ID format validation
   - Search query length limits
   - Required field validation
4. **CORS**: Controlled cross-origin requests
5. **Environment Variables**: Sensitive credentials stored securely

## Performance Optimizations

1. **Token Caching**: Spotify API tokens cached until expiry
2. **Database Indexing**: Indexed on filter fields (style, mood, context, country)
3. **Vite HMR**: Hot module replacement for fast development
4. **Connection Pooling**: MongoDB connection pool for efficiency

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple backend instances
- MongoDB replica sets for database redundancy
- Load balancer distribution (e.g., Nginx, AWS ALB)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries with proper indexing
- Implement caching layer (Redis) for frequently accessed data

### Future Enhancements
- User authentication and authorization
- CDN for static assets
- Message queue for async operations
- ElasticSearch for advanced search
- Analytics and monitoring (Datadog, New Relic)

## Development Workflow

```
Developer writes code
        ↓
Git commit locally
        ↓
Push to GitHub
        ↓
CI/CD Pipeline (GitHub Actions)
        ↓
    ┌───┴───┐
    ↓       ↓
  Tests   Linting
    ↓       ↓
    └───┬───┘
        ↓
  Build & Deploy
        ↓
    Production
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────┐
│           Load Balancer / CDN           │
│              (Cloudflare)               │
└─────────┬───────────────────────────────┘
          │
    ┌─────┴─────┐
    ↓           ↓
┌───────┐   ┌───────┐
│Node 1 │   │Node 2 │  (Multiple backend instances)
└───┬───┘   └───┬───┘
    │           │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │  MongoDB  │
    │  Cluster  │
    │ (Atlas)   │
    └───────────┘
```

## Monitoring & Logging

- Application logs (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic, Datadog)
- Database monitoring (MongoDB Atlas metrics)
- Uptime monitoring (Pingdom, UptimeRobot)
