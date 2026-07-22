# Neon PostgreSQL Setup Guide

This project is configured to use Neon PostgreSQL as the primary database. Follow these steps to configure your local development environment to connect to Neon or your own local PostgreSQL instance.

## 1. Obtain Neon Connection String

1. Log in to your [Neon Console](https://console.neon.tech/).
2. Select your project and navigate to the **Dashboard**.
3. Under **Connection Details**, copy the Postgres connection string. It should look like this:
   `postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require`

## 2. Configure Environment Variables

The project uses dynamic environment files based on `NODE_ENV`. By default (when `NODE_ENV` is not set), it looks for `.env`.

1. Copy the example environment file to `.env`:
   ```bash
   cd backend/src/config
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder `DATABASE_URL` with your Neon connection string.

   **Note**: The system is designed to automatically enforce SSL requirements when the connection string contains `neon.tech` or when running in a `production` environment.

3. To use specific environments:
   - For development, use `backend/src/config/.env.development` and run your app with `NODE_ENV=development`.
   - For production, use `backend/src/config/.env.production` and run your app with `NODE_ENV=production`.

## 3. Run Migrations

To apply the database schema to your Neon database, run the following commands from the `backend` directory:

1. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

2. **Push Schema (if testing/prototyping)**:
   ```bash
   npm run prisma:db:push
   ```

3. **Run Migrations (for tracked changes)**:
   ```bash
   npm run prisma:migrate:dev
   ```
   *Note: If you are connecting to a production Neon database, use `npm run prisma:migrate:deploy` instead.*

## 4. Verify Connection

1. Start the backend server:
   ```bash
   npm run dev
   ```
2. The server will attempt to connect to the database on startup. You should see a success message:
   `✅ Database connection successful.`

## 5. Sharing Access with Other Developers

To allow another developer to connect to the same Neon database:
1. Provide them with the **Connection String**.
2. Have them follow **Step 2** to configure their local `.env` file.
3. They only need to run `npm run prisma:generate` if the schema has already been pushed to the database. If they are making schema changes locally, they should follow the Prisma migration workflow.
