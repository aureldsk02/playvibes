import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { users, accounts, sessions, verification } from "./db/schema";

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = process.env.DATABASE_URL;
const isMockDb = isDevelopment && (!databaseUrl || databaseUrl.includes('username:password'));

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      accounts,
      sessions,
      verification,
    },
  }),
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "streaming",
        "user-read-playback-state",
        "user-modify-playback-state",
      ],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
});