import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set in environment");
}

const getPool = (): Pool => {
  if (process.env.NODE_ENV === "production") {
    return new Pool({ connectionString });
  }
  // Reuse pool in dev to avoid exhausting connections
  if (!global.__pgPool) {
    global.__pgPool = new Pool({ connectionString });
  }
  return global.__pgPool!;
};

export const pool = getPool();
