/*
  Warnings:

  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('TENTH_MARKSHEET', 'TWELFTH_MARKSHEET', 'SEMESTER_MARKSHEET', 'AADHAR_CARD', 'PAN_CARD', 'PASSPORT', 'TRANSFER_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'PHOTO', 'OTHER');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL;
