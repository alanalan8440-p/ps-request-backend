-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "decidedAt" TIMESTAMP(3),
ADD COLUMN     "decidedById" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RequestHistory" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "changedById" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "RequestHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestHistory" ADD CONSTRAINT "RequestHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestHistory" ADD CONSTRAINT "RequestHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
