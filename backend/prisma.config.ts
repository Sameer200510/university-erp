import dotenv from "dotenv";
import { defineConfig } from "prisma/config";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : process.env.NODE_ENV === "development" ? ".env.development" : ".env";

dotenv.config({
  path: path.resolve(__dirname, "src/config", envFile),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
