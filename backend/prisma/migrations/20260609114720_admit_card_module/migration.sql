-- CreateTable
CREATE TABLE "SubjectAttendanceSummary" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "totalClasses" INTEGER NOT NULL,
    "attendedClasses" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectAttendanceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmitCardConfig" (
    "id" TEXT NOT NULL,
    "minimumAttendance" DOUBLE PRECISION NOT NULL DEFAULT 75,
    "isReleased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmitCardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmitCardRelease" (
    "id" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "examType" TEXT NOT NULL,
    "isReleased" BOOLEAN NOT NULL DEFAULT false,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "AdmitCardRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRelaxation" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "documentUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceRelaxation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectAttendanceSummary_studentId_subjectId_key" ON "SubjectAttendanceSummary"("studentId", "subjectId");
