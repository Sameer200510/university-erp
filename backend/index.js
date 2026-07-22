const path = require("path");
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : process.env.NODE_ENV === "development" ? ".env.development" : ".env";

require("dotenv").config({
  path: path.resolve(__dirname, "src/config", envFile),
});

const app = require("./src/app");
const DbService = require("./src/config/dbService");

const PORT = process.env.PORT || 5050;

async function startServer() {
  // Check Database connection first
  const isDbConnected = await DbService.checkConnection();
  
  if (!isDbConnected) {
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
