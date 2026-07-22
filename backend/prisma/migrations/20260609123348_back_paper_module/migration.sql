-- CreateTable
CREATE TABLE "BackPaperApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackPaperApplication_pkey" PRIMARY KEY ("id")
);
