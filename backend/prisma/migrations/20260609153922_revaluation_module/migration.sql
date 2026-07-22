-- CreateTable
CREATE TABLE "RevaluationApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "reason" TEXT,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevaluationApplication_pkey" PRIMARY KEY ("id")
);
