import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { mockDb } from './mock';

const databaseUrl = process.env.DATABASE_URL;

// For deployment without database, use mock
export let db: any;

if (!databaseUrl || databaseUrl.includes('temp_') || databaseUrl === 'placeholder') {
  console.log('⚠️ Using mock database - configure DATABASE_URL for full functionality');
  db = mockDb as any;
} else {
  // Real PostgreSQL connection
  try {
    const connectionString = databaseUrl;
    const client = postgres(connectionString, { prepare: false });
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('Database connection failed, using mock:', error);
    db = mockDb as any;
  }
}

export * from './schema';
