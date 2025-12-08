/*
  Warnings:

  - You are about to drop the column `agric_unit_id` on the `CropSupplyUnit` table. All the data in the column will be lost.
  - You are about to drop the column `unit_name` on the `CropSupplyUnit` table. All the data in the column will be lost.
  - Added the required column `Estate_id` to the `CropSupplyUnit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CropSupplyUnit" DROP CONSTRAINT "CropSupplyUnit_agric_unit_id_fkey";

-- AlterTable
ALTER TABLE "CropSupplyUnit" DROP COLUMN "agric_unit_id",
DROP COLUMN "unit_name",
ADD COLUMN     "Estate_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Estate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "agric_unit_id" INTEGER NOT NULL,

    CONSTRAINT "Estate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Estate" ADD CONSTRAINT "Estate_agric_unit_id_fkey" FOREIGN KEY ("agric_unit_id") REFERENCES "AgricUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
