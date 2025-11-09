import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Please configure your environment variables.');
}

const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle(client, { schema });

export * from './schema';