-- DropForeignKey
ALTER TABLE "CropReception" DROP CONSTRAINT "CropReception_id_fkey";

-- AddForeignKey
ALTER TABLE "CropReception" ADD CONSTRAINT "CropReception_field_grade_id_fkey" FOREIGN KEY ("field_grade_id") REFERENCES "FieldSupply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
