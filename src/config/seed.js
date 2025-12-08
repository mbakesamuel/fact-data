import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

async function main() {
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
}

// --- AAgric Unit data ---
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

main().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});
