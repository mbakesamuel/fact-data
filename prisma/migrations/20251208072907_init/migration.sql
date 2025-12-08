-- CreateTable
CREATE TABLE "CropReception" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMP(3) NOT NULL,
    "factory_id" INTEGER NOT NULL,
    "field_grade_id" INTEGER NOT NULL,
    "supply_unit_id" INTEGER NOT NULL,
    "qtyCrop" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CropReception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropProcessing" (
    "id" SERIAL NOT NULL,
    "operation_date" TIMESTAMP(3) NOT NULL,
    "factory_id" INTEGER NOT NULL,
    "process_grade_id" INTEGER NOT NULL,
    "qtyProc" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CropProcessing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" SERIAL NOT NULL,
    "factory_name" TEXT NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropType" (
    "id" SERIAL NOT NULL,
    "cropType" TEXT NOT NULL,

    CONSTRAINT "CropType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropSupplyUnit" (
    "id" SERIAL NOT NULL,
    "unit_name" TEXT NOT NULL,
    "sub_unit_id" INTEGER NOT NULL,
    "agric_unit_id" INTEGER NOT NULL,

    CONSTRAINT "CropSupplyUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgricUnit" (
    "id" SERIAL NOT NULL,
    "agric_unit" TEXT NOT NULL,

    CONSTRAINT "AgricUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubUnit" (
    "id" SERIAL NOT NULL,
    "subUnit" TEXT NOT NULL,
    "Grp" INTEGER NOT NULL,

    CONSTRAINT "SubUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldSupply" (
    "id" SERIAL NOT NULL,
    "crop" TEXT NOT NULL,
    "productNature_id" INTEGER NOT NULL,

    CONSTRAINT "FieldSupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductNature" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,

    CONSTRAINT "ProductNature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CropReception" ADD CONSTRAINT "CropReception_id_fkey" FOREIGN KEY ("id") REFERENCES "FieldSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropReception" ADD CONSTRAINT "CropReception_supply_unit_id_fkey" FOREIGN KEY ("supply_unit_id") REFERENCES "CropSupplyUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropReception" ADD CONSTRAINT "CropReception_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropProcessing" ADD CONSTRAINT "CropProcessing_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropProcessing" ADD CONSTRAINT "CropProcessing_id_fkey" FOREIGN KEY ("id") REFERENCES "FieldSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropSupplyUnit" ADD CONSTRAINT "CropSupplyUnit_sub_unit_id_fkey" FOREIGN KEY ("sub_unit_id") REFERENCES "SubUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropSupplyUnit" ADD CONSTRAINT "CropSupplyUnit_agric_unit_id_fkey" FOREIGN KEY ("agric_unit_id") REFERENCES "AgricUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldSupply" ADD CONSTRAINT "FieldSupply_productNature_id_fkey" FOREIGN KEY ("productNature_id") REFERENCES "ProductNature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
