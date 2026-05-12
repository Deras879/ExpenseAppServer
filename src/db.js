import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || "JJStones",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  ssl:
    process.env.PG_SSL === "true"
      ? {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined,
        }
      : false,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 60000,
});
