# PlayVibes

A modern web application for discovering, sharing, and managing Spotify playlists with a social twist.

## Features

- **Spotify Authentication**: Secure OAuth integration with Spotify
- **Playlist Discovery**: Browse and search public playlists with advanced filters
- **Social Features**: Like, save, and comment on playlists
- **Real-time Playback**: Integrated Spotify Web Playback SDK
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: PostgreSQL (Neon for production, Docker for local)
- **ORM**: Drizzle
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (for local database)
- Spotify Developer Account

### Local Development

1. **Clone and install**:
   ```bash
   git clone https://github.com/kenzo207/playvibes.git
   cd playvibes
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Start local database**:
   ```bash
   docker compose up -d
   npm run db:push
   ```

4. **Run development server**:
   ```bash
   ./start.sh
   # or
   npm run dev
   ```

5. **Open** http://localhost:3000

## Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Random secret for auth (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: Your app URL
- `SPOTIFY_CLIENT_ID`: From Spotify Developer Dashboard
- `SPOTIFY_CLIENT_SECRET`: From Spotify Developer Dashboard

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

## Project Structure

```
playvibes/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (pages)/           # Page components
├── components/            # React components
├── lib/                   # Core utilities
│   ├── auth/             # Authentication
│   ├── spotify/          # Spotify integration
│   ├── utils/            # Utilities
│   └── validation/       # Input validation
├── hooks/                # Custom React hooks
└── __tests__/            # Test files
```

## Security Features

- **Rate Limiting**: Protects against abuse (Upstash Redis)
- **Input Validation**: Zod schemas for all API inputs
- **XSS Protection**: Sanitization of user-generated content
- **CSRF Protection**: Built into Better Auth

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run build
```

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Vercel deployment guide
- [TESTING.md](./TESTING.md) - Testing guide
- [START.md](./START.md) - Detailed local setup

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open a GitHub issue.