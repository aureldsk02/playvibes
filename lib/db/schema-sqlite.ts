import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table (managed by Better Auth)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  spotifyId: text('spotify_id').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Accounts table for OAuth tokens (managed by Better Auth)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
});

// Sessions table (managed by Better Auth)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Verification table (managed by Better Auth)
export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Shared playlists table
export const sharedPlaylists = sqliteTable('shared_playlists', {
  id: text('id').primaryKey(),
  spotifyPlaylistId: text('spotify_playlist_id').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  trackCount: integer('track_count').default(0),
  genres: text('genres'), // JSON string for SQLite
  moods: text('moods'), // JSON string for SQLite
  activities: text('activities'), // JSON string for SQLite
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Playlist likes table
export const playlistLikes = sqliteTable('playlist_likes', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull().references(() => sharedPlaylists.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  pk: primaryKey({ columns: [table.playlistId, table.userId] }),
}));

// Playlist comments table
export const playlistComments = sqliteTable('playlist_comments', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull().references(() => sharedPlaylists.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Saved playlists table
export const savedPlaylists = sqliteTable('saved_playlists', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull().references(() => sharedPlaylists.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  pk: primaryKey({ columns: [table.playlistId, table.userId] }),
}));

// Relations (same as PostgreSQL version)
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  sharedPlaylists: many(sharedPlaylists),
  playlistLikes: many(playlistLikes),
  playlistComments: many(playlistComments),
  savedPlaylists: many(savedPlaylists),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const sharedPlaylistsRelations = relations(sharedPlaylists, ({ one, many }) => ({
  user: one(users, {
    fields: [sharedPlaylists.userId],
    references: [users.id],
  }),
  likes: many(playlistLikes),
  comments: many(playlistComments),
  saves: many(savedPlaylists),
}));

export const playlistLikesRelations = relations(playlistLikes, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [playlistLikes.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [playlistLikes.userId],
    references: [users.id],
  }),
}));

export const playlistCommentsRelations = relations(playlistComments, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [playlistComments.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [playlistComments.userId],
    references: [users.id],
  }),
}));

export const savedPlaylistsRelations = relations(savedPlaylists, ({ one }) => ({
  playlist: one(sharedPlaylists, {
    fields: [savedPlaylists.playlistId],
    references: [sharedPlaylists.id],
  }),
  user: one(users, {
    fields: [savedPlaylists.userId],
    references: [users.id],
  }),
}));