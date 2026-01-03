-- CreateTable
CREATE TABLE "FactWeeklyPhasing" (
    "id" SERIAL NOT NULL,
    "BudYear" INTEGER NOT NULL,
    "Period" TEXT NOT NULL,
    "WeekStart" TIMESTAMP(3) NOT NULL,
    "WeekEnd" TIMESTAMP(3) NOT NULL,
    "DaysAllocated" INTEGER NOT NULL,
    "tbl_FactoryId" INTEGER NOT NULL,
    "tbl_CropTypeId" INTEGER NOT NULL,
    "weekNo" INTEGER NOT NULL,
    "WkEst" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FactWeeklyPhasing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FactWeeklyPhasing" ADD CONSTRAINT "FactWeeklyPhasing_tbl_FactoryId_fkey" FOREIGN KEY ("tbl_FactoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactWeeklyPhasing" ADD CONSTRAINT "FactWeeklyPhasing_tbl_CropTypeId_fkey" FOREIGN KEY ("tbl_CropTypeId") REFERENCES "CropType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
