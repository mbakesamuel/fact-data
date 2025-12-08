/*
  Warnings:

  - You are about to drop the column `qtyProc` on the `CropProcessing` table. All the data in the column will be lost.
  - You are about to drop the column `productNature_id` on the `FieldSupply` table. All the data in the column will be lost.
  - Added the required column `qty_proc` to the `CropProcessing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CropProcessing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `CropReception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productnature_id` to the `FieldSupply` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CropProcessing" DROP CONSTRAINT "CropProcessing_id_fkey";

-- DropForeignKey
ALTER TABLE "FieldSupply" DROP CONSTRAINT "FieldSupply_productNature_id_fkey";

-- AlterTable
ALTER TABLE "CropProcessing" DROP COLUMN "qtyProc",
ADD COLUMN     "qty_proc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CropReception" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FieldSupply" DROP COLUMN "productNature_id",
ADD COLUMN     "productnature_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CropProcessing" ADD CONSTRAINT "CropProcessing_process_grade_id_fkey" FOREIGN KEY ("process_grade_id") REFERENCES "FieldSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldSupply" ADD CONSTRAINT "FieldSupply_productnature_id_fkey" FOREIGN KEY ("productnature_id") REFERENCES "ProductNature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
