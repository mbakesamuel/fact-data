import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

async function main() {
  // --- Reset tables before seeding ---
  // The CASCADE ensures dependent tables are also cleared if they reference these
  // RESTART IDENTITY resets auto-increment IDs back to 1
  await sql`TRUNCATE TABLE "Factory" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "ProductNature" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "FieldSupply" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "SubUnit" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "CropType" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "CropPhasingRatio" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "AgricUnit" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "Estate" RESTART IDENTITY CASCADE`;
  await sql`TRUNCATE TABLE "CropSupplyUnit" RESTART IDENTITY CASCADE`;

  console.log("✅ Tables truncated successfully");

  // --- Factory data ---
  const factories = [
    { factory_name: "IU Malende" },
    { factory_name: "IU Meanja" },
    { factory_name: "IU Penda Mboko" },
    { factory_name: "IU Mukonje" },
    { factory_name: "IU Tiko" },
  ];

  for (const f of factories) {
    await sql`
      INSERT INTO "Factory" (factory_name)
      VALUES (${f.factory_name})
    `;
  }
  console.log("✅ Factories seeded successfully");

  // --- ProductNature data ---
  const productNatures = [{ product: "Unprocessed" }, { product: "Processed" }];

  for (const p of productNatures) {
    await sql`
      INSERT INTO "ProductNature" (product)
      VALUES (${p.product})
    `;
  }
  console.log("✅ ProductNature seeded successfully");

  // --- FieldSupply data ---
  const fieldSupplies = [
    { crop: "Latex", productNature_id: 1 },
    { crop: "Cuplumps", productNature_id: 1 },
    { crop: "Coagulum", productNature_id: 1 },
    { crop: "TreeLace", productNature_id: 1 },
    { crop: "RSS", productNature_id: 2 },
    { crop: "CNR 3L", productNature_id: 2 },
    { crop: "CNR 10", productNature_id: 2 },
  ];

  for (const s of fieldSupplies) {
    await sql`
      INSERT INTO "FieldSupply" (crop, productNature_id)
      VALUES (${s.crop}, ${s.productNature_id})
    `;
  }
  console.log("✅ FieldSupply seeded successfully");

  // --- SubUnit data ---
  const subUnits = [
    { subUnit: "CDC", Grp: 1 },
    { subUnit: "CRT", Grp: 1 },
    { subUnit: "SMH", Grp: 2 },
  ];

  for (const u of subUnits) {
    await sql`
      INSERT INTO "SubUnit" (sub_unit, "grp")
      VALUES (${u.subUnit}, ${u.Grp})
    `;
  }
  console.log("✅ SubUnit seeded successfully");

  // --- CropType data ---
  const cropTypes = [
    { cropType: "Latex Crumb" },
    { cropType: "FC Crumb" },
    { cropType: "Sheet" },
  ];

  for (const c of cropTypes) {
    await sql`
      INSERT INTO "CropType" (crop_type)
      VALUES (${c.cropType})
    `;
  }
  console.log("✅ CropType seeded successfully");

  // --- Monthly Phasing Ratio data ---
  const monthlyPhasingRatios = [
    {
      BudYear: 2025,
      MonthNo: 1,
      MonthName: "January",
      PhasingRatio: 0.08,
      AbPhasingRatio: 0.02,
    },
    {
      BudYear: 2025,
      MonthNo: 2,
      MonthName: "February",
      PhasingRatio: 0.07,
      AbPhasingRatio: 0.02,
    },
    {
      BudYear: 2025,
      MonthNo: 3,
      MonthName: "March",
      PhasingRatio: 0.02,
      AbPhasingRatio: 0.01,
    },
    {
      BudYear: 2025,
      MonthNo: 4,
      MonthName: "April",
      PhasingRatio: 0.05,
      AbPhasingRatio: 0.03,
    },
    {
      BudYear: 2025,
      MonthNo: 5,
      MonthName: "May",
      PhasingRatio: 0.09,
      AbPhasingRatio: 0.09,
    },
    {
      BudYear: 2025,
      MonthNo: 6,
      MonthName: "June",
      PhasingRatio: 0.1,
      AbPhasingRatio: 0.12,
    },
    {
      BudYear: 2025,
      MonthNo: 7,
      MonthName: "July",
      PhasingRatio: 0.09,
      AbPhasingRatio: 0.11,
    },
    {
      BudYear: 2025,
      MonthNo: 8,
      MonthName: "August",
      PhasingRatio: 0.08,
      AbPhasingRatio: 0.1,
    },
    {
      BudYear: 2025,
      MonthNo: 9,
      MonthName: "September",
      PhasingRatio: 0.09,
      AbPhasingRatio: 0.12,
    },
    {
      BudYear: 2025,
      MonthNo: 10,
      MonthName: "October",
      PhasingRatio: 0.1,
      AbPhasingRatio: 0.13,
    },
    {
      BudYear: 2025,
      MonthNo: 11,
      MonthName: "November",
      PhasingRatio: 0.12,
      AbPhasingRatio: 0.13,
    },
    {
      BudYear: 2025,
      MonthNo: 12,
      MonthName: "December",
      PhasingRatio: 0.11,
      AbPhasingRatio: 0.12,
    },
  ];

  for (const m of monthlyPhasingRatios) {
    await sql`
      INSERT INTO "CropPhasingRatio" ("budYear", "monthNo", "monthName", "phasingRatio", "abPhasingRatio")
      VALUES (${m.BudYear}, ${m.MonthNo}, ${m.MonthName}, ${m.PhasingRatio}, ${m.AbPhasingRatio})
    `;
  }
  console.log("✅ CropPhasingRatio seeded successfully");

  // --- Agric Unit data ---
  const agricUnit = [
    { agric_unit: "South" },
    { agric_unit: "Centre" },
    { agric_unit: "North" },
  ];

  for (const c of agricUnit) {
    await sql`
      INSERT INTO "AgricUnit" (agric_unit)
      VALUES (${c.agric_unit})
    `;
  }
  console.log("✅ Agric Unit seeded successfully");

  // --- Estates data ---
  const estates = [
    {
      name: "Missellele",
      agric_unit_id: 1,
    },
    {
      name: "Sonne-Likomba",
      agric_unit_id: 1,
    },
    {
      name: "Meanja",
      agric_unit_id: 1,
    },
    {
      name: "Kompina",
      agric_unit_id: 2,
    },
    {
      name: "Matouke",
      agric_unit_id: 2,
    },
    {
      name: "Penda Mboko",
      agric_unit_id: 2,
    },
    {
      name: "Malende",
      agric_unit_id: 3,
    },
    {
      name: "Mukonje",
      agric_unit_id: 3,
    },
    {
      name: "Mbonge",
      agric_unit_id: 3,
    },
    {
      name: "Tombel",
      agric_unit_id: 3,
    },
  ];

  for (const e of estates) {
    await sql`
      INSERT INTO "Estate" ("name", "agric_unit_id")
      VALUES (${e.name}, ${e.agric_unit_id})
    `;
  }
  console.log("✅ Estates seeded successfully");

  // --- Estates data ---
  const cropSupplyUnits = [
    {
      sub_unit_id: 1,
      estate_id: 1,
    },
    {
      sub_unit_id: 2,
      estate_id: 1,
    },
    {
      sub_unit_id: 1,
      estate_id: 2,
    },
    {
      sub_unit_id: 2,
      estate_id: 2,
    },
    {
      sub_unit_id: 3,
      estate_id: 2,
    },
    {
      sub_unit_id: 1,
      estate_id: 3,
    },
    {
      sub_unit_id: 2,
      estate_id: 3,
    },
    {
      sub_unit_id: 3,
      estate_id: 3,
    },
    {
      sub_unit_id: 1,
      estate_id: 4,
    },
    {
      sub_unit_id: 2,
      estate_id: 4,
    },
    {
      sub_unit_id: 3,
      estate_id: 4,
    },
    {
      sub_unit_id: 1,
      estate_id: 5,
    },
    {
      sub_unit_id: 2,
      estate_id: 5,
    },

    {
      sub_unit_id: 1,
      estate_id: 6,
    },
    {
      sub_unit_id: 2,
      estate_id: 6,
    },

    {
      sub_unit_id: 1,
      estate_id: 7,
    },
    {
      sub_unit_id: 2,
      estate_id: 7,
    },
    {
      sub_unit_id: 3,
      estate_id: 7,
    },
    {
      sub_unit_id: 1,
      estate_id: 8,
    },
    {
      sub_unit_id: 2,
      estate_id: 8,
    },
    {
      sub_unit_id: 3,
      estate_id: 8,
    },
    {
      sub_unit_id: 1,
      estate_id: 9,
    },
    {
      sub_unit_id: 2,
      estate_id: 9,
    },
    {
      sub_unit_id: 3,
      estate_id: 9,
    },
    {
      sub_unit_id: 1,
      estate_id: 10,
    },
    {
      sub_unit_id: 2,
      estate_id: 10,
    },
    {
      sub_unit_id: 3,
      estate_id: 10,
    },
  ];

  for (const csu of cropSupplyUnits) {
    await sql`
      INSERT INTO "CropSupplyUnit" ("sub_unit_id", "estate_id")
      VALUES (${csu.sub_unit_id}, ${csu.estate_id})
    `;
  }
  console.log("✅ CropSupplyUnit seeded successfully");
}

//call the main function to seed the database
main().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});
