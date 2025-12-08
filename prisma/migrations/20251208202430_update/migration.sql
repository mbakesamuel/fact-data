/*
  Warnings:

  - You are about to drop the column `Estate_id` on the `CropSupplyUnit` table. All the data in the column will be lost.
  - You are about to drop the column `cropType` on the `CropType` table. All the data in the column will be lost.
  - You are about to drop the column `Grp` on the `SubUnit` table. All the data in the column will be lost.
  - Added the required column `estate_id` to the `CropSupplyUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crop_type` to the `CropType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grp` to the `SubUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CropSupplyUnit" DROP COLUMN "Estate_id",
ADD COLUMN     "estate_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CropType" DROP COLUMN "cropType",
ADD COLUMN     "crop_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubUnit" DROP COLUMN "Grp",
ADD COLUMN     "grp" INTEGER NOT NULL;
