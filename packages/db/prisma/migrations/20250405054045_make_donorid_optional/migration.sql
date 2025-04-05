-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_donorId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "donorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
