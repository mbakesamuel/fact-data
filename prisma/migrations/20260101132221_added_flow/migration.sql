-- CreateTable
CREATE TABLE "crop_collection" (
    "ID" SERIAL NOT NULL,
    "BudYear" INTEGER NOT NULL,
    "tbl_CropSupplyUnitId" INTEGER NOT NULL,
    "NonFunc" BOOLEAN NOT NULL,
    "AnnProd" DECIMAL(18,2) NOT NULL,
    "Latex?" BOOLEAN NOT NULL,
    "Latex" DECIMAL(18,2),
    "OtherGrade" DECIMAL(18,2),

    CONSTRAINT "crop_collection_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Factory_flow" (
    "ID" SERIAL NOT NULL,
    "BudYear" INTEGER NOT NULL,
    "tbl_CropCollectionId" INTEGER NOT NULL,
    "tbl_FactoryId" INTEGER NOT NULL,
    "tbl_CropTypeId" INTEGER NOT NULL,
    "ProQty" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "Factory_flow_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "CropSupplyUnit" ADD CONSTRAINT "CropSupplyUnit_estate_id_fkey" FOREIGN KEY ("estate_id") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop_collection" ADD CONSTRAINT "crop_collection_tbl_CropSupplyUnitId_fkey" FOREIGN KEY ("tbl_CropSupplyUnitId") REFERENCES "CropSupplyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_flow" ADD CONSTRAINT "Factory_flow_tbl_CropCollectionId_fkey" FOREIGN KEY ("tbl_CropCollectionId") REFERENCES "crop_collection"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_flow" ADD CONSTRAINT "Factory_flow_tbl_FactoryId_fkey" FOREIGN KEY ("tbl_FactoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory_flow" ADD CONSTRAINT "Factory_flow_tbl_CropTypeId_fkey" FOREIGN KEY ("tbl_CropTypeId") REFERENCES "CropType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
