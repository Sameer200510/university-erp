const prisma = require('./prisma');

/**
 * Service to manage and verify the database connection
 */
class DbService {
  /**
   * Checks the database connection by executing a simple query
   * @returns {Promise<boolean>} True if connection is successful, false otherwise
   */
  static async checkConnection() {
    try {
      // Execute a simple query to test the connection
      await prisma.$queryRaw`SELECT 1 as result`;
      console.log('✅ Database connection successful.');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:');
      if (error.code === 'P2024') {
        console.error('   Could not connect to the database. Please check your DATABASE_URL and ensure the database server is running.');
      } else {
        console.error(error.message || error);
      }
      return false;
    }
  }

  /**
   * Gracefully close the database connection
   */
  static async disconnect() {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  }
}

module.exports = DbService;
