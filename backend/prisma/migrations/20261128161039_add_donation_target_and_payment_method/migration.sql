-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "paymentMethod" TEXT;

-- CreateTable
CREATE TABLE "DonationTarget" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationTarget_pkey" PRIMARY KEY ("id")
);
