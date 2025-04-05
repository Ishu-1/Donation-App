/*
  Warnings:

  - You are about to drop the column `details` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `pId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "details",
ADD COLUMN     "pId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
