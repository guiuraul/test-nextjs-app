import "server-only";

import { sql } from "drizzle-orm";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

export async function withUserContext<T>(
  userId: string,
  callback: (tx: Parameters<Parameters<PostgresJsDatabase<typeof schema>["transaction"]>[0]>[0]) => Promise<T>
) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('request.jwt.claim.sub', ${userId}, true)`);
    await tx.execute(sql`select set_config('request.jwt.claim.role', 'authenticated', true)`);

    return callback(tx);
  });
}

