/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Request` table. All the data in the column will be lost.
  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_studentId_fkey";

-- DropIndex
DROP INDEX "Request_createdAt_idx";

-- DropIndex
DROP INDEX "Request_status_idx";

-- DropIndex
DROP INDEX "Request_studentId_idx";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
