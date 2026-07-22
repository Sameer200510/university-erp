# University ERP & Admission Portal System

A modern, comprehensive Enterprise Resource Planning (ERP) and Admission Management system designed for Graphic Era University. Built with full-stack capabilities utilizing **Node.js, Express, Prisma ORM, Neon Cloud PostgreSQL, and React (Vite + Tailwind CSS + Zustand)**.

---

## 🌟 Key Features & Highlights

1. **Seamless Cloud Database (Neon PostgreSQL)**
   - No local PostgreSQL setup required. Connected directly to **Neon Cloud Database** via `.env`.
   - Accessible from any computer with internet connection without local DB configuration.
2. **Admission Portal & Application Tracking**
   - Students can apply online via `/admission/apply`.
   - **Support for Multiple Applications**: Students/counselors can submit multiple applications using the exact same email ID and phone number without database conflicts.
   - **Short Reference IDs**: Search and track applications using both short reference IDs (e.g., `REF...` or `6159...`) and full UUIDs.
3. **Automated ERP Student Account & Admission Letter Generation**
   - Upon document verification and payment marking, the backend automatically generates a fresh **Student ERP Account** (`loginId` like `2026xxxx` and secure password).
   - Instant verification emails sent with student login credentials via Nodemailer.
   - **Official Admission Letter Generation**: Print-ready, professionally formatted admission letters with instant ERP ID display upon payment confirmation.
4. **Role-Based Access Control (RBAC)**
   - Secure JWT authentication across multiple modules.
   - Dedicated dashboards for Admission Officers and Students.

---

## 🔐 Default Credentials for Testing

### 1. Admission Officer Portal (`/login`)
- **User ID**: `ADM001`
- **Password**: `Pass123`

---

## 🚀 Quick Start Guide (Windows)

### Option 1: One-Click Start (Recommended)
Run the PowerShell start script from the project root directory:
```powershell
.\start_all.ps1
```
This script automatically starts both the **Backend API Server** (Port `5050`) and **Frontend Vite Server** (Port `5173`/`3000`) in separate windows.

---

### Option 2: Manual Setup

#### 1. Backend Setup (`/backend`)
```powershell
cd backend
npm install

# Ensure src/config/.env contains valid Neon Cloud DATABASE_URL
# Push schema updates and sync database
npx prisma db push --accept-data-loss

# Start Backend Server
npm run dev
```

#### 2. Frontend Setup (`/frontend`)
```powershell
cd frontend
npm install

# Start Vite Development Server
npm run dev
```

---

## 📁 System Architecture

```
university-erp/
├── backend/
│   ├── prisma/             # Prisma Schema & Migrations
│   ├── src/
│   │   ├── config/         # Environment variables (.env) & Prisma config
│   │   ├── modules/        # Modular API routes & services (erp-leads, etc.)
│   │   └── index.js        # Main Express server entry
├── frontend/
│   ├── src/
│   │   ├── admission-portal/ # Applications, ApplicationDetail, AdmissionLetter
│   │   ├── auth/           # Login & Auth services
│   │   ├── student-portal/ # Academic, Attendance, Exam, Fees, Profile modules
│   │   └── shared/         # Global utilities, components, and store
├── start_all.ps1           # Quick start PowerShell script
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Zustand, Sonner (Toast notifications)
- **Backend**: Node.js, Express.js, Prisma ORM, Bcrypt, Nodemailer
- **Database**: PostgreSQL (Hosted on Neon Cloud)
- **Version Control**: Git & GitHub (`https://github.com/Sameer200510/university-erp`)

