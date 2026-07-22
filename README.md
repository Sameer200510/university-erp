# University ERP System

# VARUN DOBHAL BRANCH

A modern, comprehensive Enterprise Resource Planning (ERP) system designed for universities, built with Node.js, Express, Prisma, PostgreSQL, and React.

## System Architecture

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React + Vite + Tailwind CSS + Zustand
- **Authentication**: JWT & Role-Based Access Control (RBAC)

## Available Roles

- `SUPER_ADMIN`
- `ADMISSION_OFFICER`
- `STUDENT`

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Docker & Docker Compose (Optional for containerized setup)

---

## Local Development Setup

### 1. Database Setup

Ensure PostgreSQL is running locally and you have a database created.
Default configuration expects a database named `erp_core`.

### 2. Backend Setup

```bash
cd backend
npm install

# Create a .env file based on your local database credentials
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/erp_core"
# Example: JWT_SECRET="your_secret_key"
# Example: PORT=5000

# Push the schema to your database and generate Prisma Client
npx prisma db push --accept-data-loss
npx prisma generate

# Seed test accounts (ADMIN001, ADM001, STU001 with password: password123)
node scripts/seed-users.js

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

---

## Docker Deployment

This project includes a fully orchestrated Docker Compose setup.

### Run with Docker Compose

```bash
# From the root directory
docker-compose up --build -d
```

### Accessing the application

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Database**: PostgreSQL on `localhost:5432`

## CI/CD Pipeline

This repository includes a GitHub Actions pipeline (`.github/workflows/ci.yml`) that validates syntax, linting, and Prisma generation on every push to the `main` branch.
