/*
  Warnings:

  - You are about to drop the column `subUnit` on the `SubUnit` table. All the data in the column will be lost.
  - Added the required column `sub_unit` to the `SubUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubUnit" DROP COLUMN "subUnit",
ADD COLUMN     "sub_unit" TEXT NOT NULL;
