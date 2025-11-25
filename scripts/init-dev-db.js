import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Initializing development database...');

// Create a simple SQL file for the required tables
const sqlContent = `
-- Users table (managed by Better Auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  spotify_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table for OAuth tokens (managed by Better Auth)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT
);

-- Sessions table (managed by Better Auth)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification table (managed by Better Auth)
CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shared playlists table
CREATE TABLE IF NOT EXISTS shared_playlists (
  id TEXT PRIMARY KEY,
  spotify_playlist_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  track_count INTEGER DEFAULT 0,
  genres TEXT[], -- PostgreSQL array
  moods TEXT[], -- PostgreSQL array
  activities TEXT[], -- PostgreSQL array
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist likes table
CREATE TABLE IF NOT EXISTS playlist_likes (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL REFERENCES shared_playlists(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, user_id)
);

-- Playlist comments table
CREATE TABLE IF NOT EXISTS playlist_comments (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL REFERENCES shared_playlists(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved playlists table
CREATE TABLE IF NOT EXISTS saved_playlists (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL REFERENCES shared_playlists(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, user_id)
);
`;

// Write the SQL file
const sqlPath = path.join(__dirname, '..', 'init-dev.sql');
fs.writeFileSync(sqlPath, sqlContent);

console.log('Development database initialization SQL created at:', sqlPath);
console.log('To apply these changes to your PostgreSQL database, run:');
console.log(`psql $DATABASE_URL -f ${sqlPath}`);
console.log('');
console.log('Or if you have a local PostgreSQL setup:');
console.log(`psql -d playvibes -f ${sqlPath}`);