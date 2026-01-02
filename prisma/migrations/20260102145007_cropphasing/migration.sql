-- CreateTable
CREATE TABLE "CropPhasingRatio" (
    "id" SERIAL NOT NULL,
    "budYear" INTEGER NOT NULL,
    "monthNo" INTEGER NOT NULL,
    "monthName" TEXT NOT NULL,
    "phasingRatio" DOUBLE PRECISION NOT NULL,
    "abPhasingRatio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CropPhasingRatio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcEstMonthlyPhasing" (
    "id" SERIAL NOT NULL,
    "tbl_FactoryID" INTEGER NOT NULL,
    "tbl_CropTypeID" INTEGER NOT NULL,
    "tbl_CropCollectionId" INTEGER NOT NULL,
    "effDate" TIMESTAMP(3) NOT NULL,
    "monthEst" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProcEstMonthlyPhasing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProcEstMonthlyPhasing" ADD CONSTRAINT "ProcEstMonthlyPhasing_tbl_FactoryID_fkey" FOREIGN KEY ("tbl_FactoryID") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcEstMonthlyPhasing" ADD CONSTRAINT "ProcEstMonthlyPhasing_tbl_CropTypeID_fkey" FOREIGN KEY ("tbl_CropTypeID") REFERENCES "CropType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcEstMonthlyPhasing" ADD CONSTRAINT "ProcEstMonthlyPhasing_tbl_CropCollectionId_fkey" FOREIGN KEY ("tbl_CropCollectionId") REFERENCES "crop_collection"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
