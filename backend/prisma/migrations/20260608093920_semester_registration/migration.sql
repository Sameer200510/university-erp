-- CreateTable
CREATE TABLE "SemesterRegistration" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "currentSemester" INTEGER NOT NULL,
    "nextSemester" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SemesterRegistration_pkey" PRIMARY KEY ("id")
);
