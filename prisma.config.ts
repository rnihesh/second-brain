import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local
config({ path: '.env.local' });

console.log('DATABASE_URL from config:', process.env.DATABASE_URL);

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
