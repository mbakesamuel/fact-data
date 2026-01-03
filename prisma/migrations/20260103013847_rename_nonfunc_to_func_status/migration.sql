/*
  Warnings:

  - You are about to drop the column `nonFunctional` on the `CropCollection` table. All the data in the column will be lost.
  - Added the required column `func_status` to the `CropCollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CropCollection" DROP COLUMN "nonFunctional",
ADD COLUMN     "func_status" BOOLEAN NOT NULL;
