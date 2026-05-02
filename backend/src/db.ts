import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Default connection string if none is provided in .env
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/babys';

// Neon requires SSL. If the connection string includes neon.tech, enable SSL.
const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
});

export const db = drizzle(pool, { schema });
