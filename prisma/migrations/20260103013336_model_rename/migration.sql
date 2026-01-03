/*
  Warnings:

  - You are about to drop the `Factory_flow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crop_collection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Factory_flow" DROP CONSTRAINT "Factory_flow_tbl_CropCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "Factory_flow" DROP CONSTRAINT "Factory_flow_tbl_CropTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Factory_flow" DROP CONSTRAINT "Factory_flow_tbl_FactoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProcEstMonthlyPhasing" DROP CONSTRAINT "ProcEstMonthlyPhasing_tbl_CropCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "crop_collection" DROP CONSTRAINT "crop_collection_tbl_CropSupplyUnitId_fkey";

-- DropTable
DROP TABLE "Factory_flow";

-- DropTable
DROP TABLE "crop_collection";

-- CreateTable
CREATE TABLE "CropCollection" (
    "id" SERIAL NOT NULL,
    "budYear" INTEGER NOT NULL,
    "cropSupplyUnitId" INTEGER NOT NULL,
    "nonFunctional" BOOLEAN NOT NULL,
    "annProd" DECIMAL(18,2) NOT NULL,
    "latexQty" DECIMAL(18,2),
    "otherGradeQty" DECIMAL(18,2),

    CONSTRAINT "CropCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryFlow" (
    "id" SERIAL NOT NULL,
    "cropCollectionId" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "cropTypeId" INTEGER NOT NULL,
    "procQty" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "FactoryFlow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CropCollection" ADD CONSTRAINT "CropCollection_cropSupplyUnitId_fkey" FOREIGN KEY ("cropSupplyUnitId") REFERENCES "CropSupplyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryFlow" ADD CONSTRAINT "FactoryFlow_cropCollectionId_fkey" FOREIGN KEY ("cropCollectionId") REFERENCES "CropCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryFlow" ADD CONSTRAINT "FactoryFlow_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryFlow" ADD CONSTRAINT "FactoryFlow_cropTypeId_fkey" FOREIGN KEY ("cropTypeId") REFERENCES "CropType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcEstMonthlyPhasing" ADD CONSTRAINT "ProcEstMonthlyPhasing_tbl_CropCollectionId_fkey" FOREIGN KEY ("tbl_CropCollectionId") REFERENCES "CropCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
