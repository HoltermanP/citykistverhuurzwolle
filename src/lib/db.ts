import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is niet ingesteld in .env.local");
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = (() => {
  // Lazy proxy: verbinding pas aanmaken bij eerste gebruik
  let _db: ReturnType<typeof getDb> | null = null;
  return new Proxy({} as ReturnType<typeof getDb>, {
    get(_, prop) {
      if (!_db) _db = getDb();
      return (_db as any)[prop];
    },
  });
})();
