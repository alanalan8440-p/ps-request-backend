/*
  Warnings:

  - You are about to drop the column `fromDate` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `justification` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Staff` table. All the data in the column will be lost.
  - The `role` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `message` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "fromDate",
DROP COLUMN "justification",
DROP COLUMN "toDate",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "proofUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "deletedAt",
ADD COLUMN     "firstLogin" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "RequestType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE INDEX "Request_studentId_idx" ON "Request"("studentId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Student_registration_idx" ON "Student"("registration");
