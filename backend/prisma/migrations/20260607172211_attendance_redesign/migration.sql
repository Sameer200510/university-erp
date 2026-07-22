/*
  Warnings:

  - You are about to drop the column `attendedClasses` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `totalClasses` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,subjectId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "attendedClasses",
DROP COLUMN "percentage",
DROP COLUMN "semester",
DROP COLUMN "totalClasses",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "AttendanceStatus" NOT NULL,
ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "facultyName" TEXT;

-- CreateTable
CREATE TABLE "AttendanceSummary" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "totalClasses" INTEGER NOT NULL,
    "attendedClasses" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");

-- CreateIndex
CREATE INDEX "Attendance_subjectId_idx" ON "Attendance"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_subjectId_date_key" ON "Attendance"("studentId", "subjectId", "date");
