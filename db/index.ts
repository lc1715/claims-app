import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance with schema
const db = drizzle(client, { schema });

// Export drizzle instance
export default db;

// Export schema types
export { schema };