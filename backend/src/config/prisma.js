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
  max: 15,
  idleTimeoutMillis: 30000, // Close idle clients after 30s so stale severed sockets aren't used
  connectionTimeoutMillis: 15000,
};

// Enable SSL if using Neon PostgreSQL
if (dbUrl && (dbUrl.includes("neon.tech") || process.env.NODE_ENV === "production")) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// Handle idle client errors gracefully
pool.on("error", (err) => {
  console.error("Unexpected error on idle database client, discarding socket:", err.message);
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
