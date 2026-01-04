import { sql } from "../config/db.js";
import { generateWeeklyPhasing } from "../services/weeklyPhasing.js";

export async function CreateWeeklyPhasing(req, res) {
  const { baseYear } = req.body;
  try {
    await generateWeeklyPhasing(baseYear);
    res.status(200).json({ message: "Weekly phasing generated successfully." });
  } catch (error) {
    console.error("Error in CreateWeeklyPhasing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getPhasingEstimates(req, res) {
  try {
    const { year, factoryId, date } = req.query; // e.g. '2026-01-03'

    // --- Daily estimate ---
    const dailyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "DailyEst",
        fac."factory_name"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "Factory" fac ON fwp."tbl_FactoryId" = fac."id"
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date;
    `;

    const dailyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date = ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Weekly estimate ---
    const weeklyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        fwp."WkEst",
        fwp."WeekStart",
        fwp."WeekEnd",
        fwp."weekNo",
        fwp."Period"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date;
    `;

    const weeklyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('week', ${date}::date) 
                                         AND DATE_TRUNC('week', ${date}::date) + interval '6 days'
      GROUP BY r."field_grade_id";
    `;

    // --- Monthly estimate (current month only) ---
    const monthlyRows = await sql`
      SELECT 
        p."tbl_CropTypeID",
        ct."crop_type",
        p."monthEst"
      FROM "ProcEstMonthlyPhasing" p
      INNER JOIN "CropType" ct ON p."tbl_CropTypeID" = ct."id"
      WHERE EXTRACT(YEAR FROM p."effDate") = EXTRACT(YEAR FROM ${date}::date)
        AND EXTRACT(MONTH FROM p."effDate") = EXTRACT(MONTH FROM ${date}::date)
        AND p."tbl_FactoryID" = ${factoryId};
    `;

    const monthlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND EXTRACT(YEAR FROM r."operation_date") = EXTRACT(YEAR FROM ${date}::date)
        AND EXTRACT(MONTH FROM r."operation_date") = EXTRACT(MONTH FROM ${date}::date)
      GROUP BY r."field_grade_id";
    `;

    // --- Yearly estimate (year-to-date until today) ---
    const yearlyRows = await sql`
      SELECT 
        p."tbl_CropTypeID",
        ct."crop_type",
        SUM(p."monthEst") AS "yearEst"
      FROM "ProcEstMonthlyPhasing" p
      INNER JOIN "CropType" ct ON p."tbl_CropTypeID" = ct."id"
      WHERE EXTRACT(YEAR FROM p."effDate") = EXTRACT(YEAR FROM ${date}::date)
        AND p."tbl_FactoryID" = ${factoryId}
        AND p."effDate"::date <= ${date}::date
      GROUP BY p."tbl_CropTypeID", ct."crop_type";
    `;

    const yearlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND EXTRACT(YEAR FROM r."operation_date") = EXTRACT(YEAR FROM ${date}::date)
        AND r."operation_date"::date <= ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Build response ---
    const daily = dailyRows.map((r) => {
      const actual =
        dailyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      return {
        cropTypeId: r.tbl_CropTypeId,
        crop_type: r.crop_type,
        dailyEstimate: r.DailyEst,
        actualReception: actual,
        variance: actual - r.DailyEst,
      };
    });

    const weekly = weeklyRows.map((r) => {
      const actual =
        weeklyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      return {
        cropTypeId: r.tbl_CropTypeId,
        crop_type: r.crop_type,
        weeklyEstimate: r.WkEst,
        actualReception: actual,
        variance: actual - r.WkEst,
        weekNo: r.weekNo,
        period: r.Period,
      };
    });

    const monthly = {};
    const monthKey = new Date(date).toLocaleString("default", {
      month: "long",
    });
    monthly[monthKey] = {};
    monthlyRows.forEach((r) => {
      const actual =
        monthlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeID)
          ?.actualReception ?? 0;
      monthly[monthKey][r.crop_type] = {
        estimate: Number(r.monthEst),
        actual,
        variance: actual - Number(r.monthEst),
      };
    });

    const yearly = {};
    yearlyRows.forEach((r) => {
      const actual =
        yearlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeID)
          ?.actualReception ?? 0;
      yearly[r.crop_type] = {
        estimate: Number(r.yearEst),
        actual,
        variance: actual - Number(r.yearEst),
      };
    });

    res.json({
      date,
      factoryId,
      factory_name: dailyRows[0]?.factory_name || weeklyRows[0]?.factory_name,
      estimates: {
        daily,
        weekly,
        monthly,
        yearly,
      },
    });
  } catch (err) {
    console.error("Error fetching phasing estimates:", err);
    res.status(500).json({ error: err.message });
  }
}
