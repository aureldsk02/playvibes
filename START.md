# Local Development Setup

Complete guide for setting up PlayVibes locally.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/kenzo207/playvibes.git
cd playvibes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database (Local Docker)
DATABASE_URL="postgresql://postgres:password@localhost:5432/playvibes"

# Authentication
BETTER_AUTH_SECRET="<generate-with-openssl-rand-base64-32>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Spotify Developer Credentials
SPOTIFY_CLIENT_ID="<your-spotify-client-id>"
SPOTIFY_CLIENT_SECRET="<your-spotify-client-secret>"
```

### 4. Database Setup

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

Push database schema:

```bash
npm run db:push
```

Verify database is running:

```bash
docker compose ps
```

### 5. Start Development Server

#### Option A: Using the startup script (recommended)

```bash
chmod +x start.sh
./start.sh
```

The script automatically:
- Checks for `.env.local`
- Installs dependencies if needed
- Verifies database connection
- Kills any process on port 3000
- Starts the dev server

#### Option B: Using npm directly

```bash
npm run dev
```

### 6. Access Application

Open http://localhost:3000 in your browser.

## Spotify Developer Setup

### Create Spotify App

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in:
   - **App name**: PlayVibes Dev
   - **App description**: Local development
   - **Redirect URIs**: 
     ```
     http://localhost:3000/api/auth/callback/spotify
     http://localhost:3001/api/auth/callback/spotify
     http://localhost:3002/api/auth/callback/spotify
     ```
   - **Website**: http://localhost:3000
   - **API**: Check "Web API"
5. Save the app
6. Go to Settings
7. Copy **Client ID** and **Client Secret**
8. Update `.env.local` with these values

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Setup
npm run setup        # Install deps + push schema
npm run prepare      # Setup Husky hooks
```

## Docker Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps

# Restart database
docker compose restart
```

## Troubleshooting

### Port 3000 Already in Use

The `start.sh` script automatically handles this. If using `npm run dev`:

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Failed

Check if Docker is running:

```bash
docker compose ps
```

If not running:

```bash
docker compose up -d
```

Verify `DATABASE_URL` in `.env.local` matches:

```
postgresql://postgres:password@localhost:5432/playvibes
```

### Spotify Authentication Fails

**"Invalid redirect URI"**:
- Ensure redirect URI in Spotify Dashboard exactly matches: `http://localhost:3000/api/auth/callback/spotify`
- No trailing slash
- Check port number (3000, 3001, or 3002)

**"INVALID_CLIENT"**:
- Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`
- Ensure they match values in Spotify Dashboard

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Test Failures

Update snapshots if needed:

```bash
npm test -- -u
```

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test locally

3. Run quality checks:
   ```bash
   npm run lint
   npm run format
   npm test
   ```

4. Commit changes (Husky runs pre-commit hooks automatically):
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. Push and create pull request:
   ```bash
   git push origin feature/your-feature
   ```

## Project Structure

```
playvibes/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (pages)/           # Page components
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── playlists/        # Playlist components
│   └── ui/               # UI components
├── lib/                   # Core utilities
│   ├── auth/             # Auth configuration
│   ├── spotify/          # Spotify integration
│   ├── utils/            # Utility functions
│   └── validation/       # Zod schemas
├── hooks/                # Custom React hooks
├── __tests__/            # Test files
├── public/               # Static assets
└── docker-compose.yml    # Local database config
```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Read [TESTING.md](./TESTING.md) for testing guidelines
- Check [README.md](./README.md) for project overview
