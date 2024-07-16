// import { drizzle } from "drizzle-orm/libsql";
// import { createClient } from "@libsql/client";

// const client = createClient({
//   url: process.env.TURSO_CONNECTION_URL!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// });
// export const db = drizzle(client);

// db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const databaseUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
  throw new Error('TURSO_CONNECTION_URL no está definida en las variables de entorno de Cloudflare Pages');
}

if (!authToken) {
  throw new Error('TURSO_AUTH_TOKEN no está definida en las variables de entorno de Cloudflare Pages');
}

const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

export const db = drizzle(client);
