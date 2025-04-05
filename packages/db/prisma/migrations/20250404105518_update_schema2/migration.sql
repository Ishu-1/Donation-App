/*
  Warnings:

  - You are about to drop the column `pId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Donation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "pId",
DROP COLUMN "quantity",
ADD COLUMN     "details" JSONB[];
