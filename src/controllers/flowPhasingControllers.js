import { sql } from "../config/db.js";

// factoryFlowPhasing.js
import { sql } from "../config/db.js";

export async function factoryFlowPhasing(baseYear) {
  try {
    // 1. Clear previous data
    await sql`
      DELETE FROM "tbl_AnnProcEst_monthlyPhasing"
      WHERE EXTRACT(YEAR FROM "EffDate") = ${baseYear};
    `;

    // 2. Load ratios
    const ratios = await sql`
      SELECT "MonthNo", "PhasingRatio", "AbPhasingRatio"
      FROM "tbl_MonthlyPhasingRatio"
      WHERE "BudYear" = ${baseYear};
    `;

    const monthlyPercents = {};
    const monthlyAbPercents = {};
    ratios.forEach(r => {
      monthlyPercents[r.MonthNo] = r.PhasingRatio || 0;
      monthlyAbPercents[r.MonthNo] = r.AbPhasingRatio || 0;
    });

    // 3. Load factory flow records
    const flows = await sql`
      SELECT ff."ID", ff."BudYear", ff."tbl_CropCollectionId",
             ff."tbl_FactoryId", ff."tbl_CropTypeId", ff."ProQty",
             cc."NonFunc"
      FROM "tbl_CropCollection" cc
      INNER JOIN "tbl_FactoryFlow" ff
      ON cc."ID" = ff."tbl_CropCollectionId";
    `;

    // 4. Loop through flows and insert monthly phasing
    for (const flow of flows) {
      const proQty = flow.ProQty || 0;
      const nonFunc = flow.NonFunc;

      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        const effDate = new Date(baseYear, monthIndex - 1, 1);
        const ratio = nonFunc
          ? monthlyAbPercents[monthIndex]
          : monthlyPercents[monthIndex];
        const monthEst = Math.round(proQty * ratio * 100) / 100;

        await sql`
          INSERT INTO "tbl_AnnProcEst_monthlyPhasing"
            ("tbl_FactoryID", "tbl_CropTypeID", "tbl_CropCollectionId", "EffDate", "MonthEst")
          VALUES (${flow.tbl_FactoryId}, ${flow.tbl_CropTypeId}, ${flow.tbl_CropCollectionId}, ${effDate}, ${monthEst});
        `;
      }
    }

    console.log("Monthly phasing generated successfully.");
  } catch (err) {
    console.error("Error in factoryFlowPhasing:", err);
    throw err;
  }
}
