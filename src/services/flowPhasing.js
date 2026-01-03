// factoryFlowPhasing.js
import { sql } from "../config/db.js";

export async function flowPhasing(baseYear) {
  try {
    // 1. Clear previous data
    await sql`
      DELETE FROM "ProcEstMonthlyPhasing"
      WHERE EXTRACT(YEAR FROM "effDate") = ${baseYear};
    `;

    // 2. Load ratios
    const ratios = await sql`
      SELECT "monthNo", "phasingRatio", "abPhasingRatio"
      FROM "CropPhasingRatio"
      WHERE "budYear" = ${baseYear};
    `;

    const monthlyPercents = {};
    const monthlyAbPercents = {};
    /*  ratios.forEach((r) => {
      monthlyPercents[r.MonthNo] = r.PhasingRatio || 0;
      monthlyAbPercents[r.MonthNo] = r.AbPhasingRatio || 0;
    }); */

    ratios.forEach((r) => {
      monthlyPercents[r.monthNo] = r.phasingRatio || 0;
      monthlyAbPercents[r.monthNo] = r.abPhasingRatio || 0;
    });

    // 3. Load factory flow records
    const flows = await sql`
      SELECT ff."id", cc."budYear", ff."cropCollectionId",
             ff."factoryId", ff."cropTypeId", ff."procQty",
             cc."func_status"
      FROM "CropCollection" cc
      INNER JOIN "FactoryFlow" ff
      ON cc."id" = ff."cropCollectionId";
    `;

    // 4. Loop through flows and insert monthly phasing
    for (const flow of flows) {
      const proQty = flow.procQty || 0; // use correct key
      const nonFunc = flow.func_status;

      for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        const effDate = new Date(baseYear, monthIndex - 1, 1);
        const ratio = nonFunc
          ? monthlyAbPercents[monthIndex]
          : monthlyPercents[monthIndex];
        const monthEst = Math.round(proQty * ratio * 100) / 100;

        await sql`
      INSERT INTO "ProcEstMonthlyPhasing"
        ("tbl_FactoryID", "tbl_CropTypeID", "tbl_CropCollectionId", "effDate", "monthEst")
      VALUES (${flow.factoryId}, ${flow.cropTypeId}, ${flow.cropCollectionId}, ${effDate}, ${monthEst});
    `;
      }
    }

    console.log("Monthly phasing generated successfully.");
  } catch (err) {
    console.error("Error in factoryFlowPhasing:", err);
    throw err;
  }
}
