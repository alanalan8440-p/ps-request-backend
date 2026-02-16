/*
  Warnings:

  - You are about to drop the column `decidedAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `decidedById` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `RequestHistory` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `Staff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OFFICER');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('OD', 'LEAVE');

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_decidedById_fkey";

-- DropForeignKey
ALTER TABLE "RequestHistory" DROP CONSTRAINT "RequestHistory_changedById_fkey";

-- DropForeignKey
ALTER TABLE "RequestHistory" DROP CONSTRAINT "RequestHistory_requestId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "decidedAt",
DROP COLUMN "decidedById",
DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "type",
ADD COLUMN     "type" "RequestType" NOT NULL;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "RequestHistory";

-- CreateIndex
CREATE INDEX "Request_studentId_idx" ON "Request"("studentId");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "Request"("status");

-- CreateIndex
CREATE INDEX "Request_createdAt_idx" ON "Request"("createdAt");

-- CreateIndex
CREATE INDEX "Staff_staffId_idx" ON "Staff"("staffId");

-- CreateIndex
CREATE INDEX "Student_registration_idx" ON "Student"("registration");
