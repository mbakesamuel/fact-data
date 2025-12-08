/*
  Warnings:

  - You are about to drop the column `qtyCrop` on the `CropReception` table. All the data in the column will be lost.
  - Added the required column `qty_crop` to the `CropReception` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CropReception" DROP COLUMN "qtyCrop",
ADD COLUMN     "qty_crop" DOUBLE PRECISION NOT NULL;
