const path = require("path");
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : process.env.NODE_ENV === "development" ? ".env.development" : ".env";

require("dotenv").config({
  path: path.resolve(__dirname, envFile),
});

console.log(`Loaded environment: ${envFile}`);

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const dbUrl = process.env.DATABASE_URL;

const poolConfig = {
  connectionString: dbUrl,
};

// Enable SSL if using Neon PostgreSQL
if (dbUrl && (dbUrl.includes("neon.tech") || process.env.NODE_ENV === "production")) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
