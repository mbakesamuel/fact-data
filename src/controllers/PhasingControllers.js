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
/* 
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

    // --- Weekly estimate (week-to-date cumulative) ---
    const weeklyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "WkToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const weeklyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('week', ${date}::date) 
                                         AND ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Monthly estimate (month-to-date cumulative) ---
    const monthlyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "MonthToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND fwp."WeekStart"::date >= DATE_TRUNC('month', ${date}::date)
        AND fwp."WeekEnd"::date <= ${date}::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const monthlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('month', ${date}::date)
                                         AND ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Yearly estimate (year-to-date cumulative) ---
    const yearlyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "YearToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND fwp."WeekStart"::date >= DATE_TRUNC('year', ${date}::date)
        AND fwp."WeekEnd"::date <= ${date}::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const yearlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('year', ${date}::date)
                                         AND ${date}::date
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
        weeklyEstimate: r.WkToDateEst,
        actualReception: actual,
        variance: actual - r.WkToDateEst,
      };
    });

    const monthly = {};
    const monthKey = new Date(date).toLocaleString("default", {
      month: "long",
    });
    monthly[monthKey] = {};
    monthlyRows.forEach((r) => {
      const actual =
        monthlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      monthly[monthKey][r.crop_type] = {
        estimate: Number(r.MonthToDateEst),
        actual,
        variance: actual - Number(r.MonthToDateEst),
      };
    });

    const yearly = {};
    yearlyRows.forEach((r) => {
      const actual =
        yearlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      yearly[r.crop_type] = {
        estimate: Number(r.YearToDateEst),
        actual,
        variance: actual - Number(r.YearToDateEst),
      };
    });

    res.json({
      date,
      factoryId,
      factory_name: dailyRows[0]?.factory_name,
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
 */

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

    // --- Weekly estimate (week-to-date cumulative) ---
    const weeklyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(
          (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) *
          ((LEAST(${date}::date, fwp."WeekEnd"::date) 
            - GREATEST(DATE_TRUNC('week', ${date}::date)::date, fwp."WeekStart"::date)
          )::int + 1)
        ) AS "WkToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND fwp."WeekEnd"::date >= DATE_TRUNC('week', ${date}::date)
        AND fwp."WeekStart"::date <= ${date}::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const weeklyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('week', ${date}::date) 
                                         AND ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Monthly estimate (month-to-date cumulative) ---
    const monthlyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(
          (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) *
          ((LEAST(${date}::date, fwp."WeekEnd"::date) 
            - GREATEST(DATE_TRUNC('month', ${date}::date)::date, fwp."WeekStart"::date)
          )::int + 1)
        ) AS "MonthToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND fwp."WeekEnd"::date >= DATE_TRUNC('month', ${date}::date)
        AND fwp."WeekStart"::date <= ${date}::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const monthlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('month', ${date}::date)
                                         AND ${date}::date
      GROUP BY r."field_grade_id";
    `;

    // --- Yearly estimate (year-to-date cumulative) ---
    const yearlyRows = await sql`
      SELECT 
        fwp."tbl_CropTypeId",
        ct."crop_type",
        SUM(
          (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) *
          ((LEAST(${date}::date, fwp."WeekEnd"::date) 
            - GREATEST(DATE_TRUNC('year', ${date}::date)::date, fwp."WeekStart"::date)
          )::int + 1)
        ) AS "YearToDateEst"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND fwp."WeekEnd"::date >= DATE_TRUNC('year', ${date}::date)
        AND fwp."WeekStart"::date <= ${date}::date
      GROUP BY fwp."tbl_CropTypeId", ct."crop_type";
    `;

    const yearlyReception = await sql`
      SELECT 
        r."field_grade_id" AS "cropTypeId",
        SUM(r."qty_crop") AS "actualReception"
      FROM "CropReception" r
      WHERE r."factory_id" = ${factoryId}
        AND r."operation_date"::date BETWEEN DATE_TRUNC('year', ${date}::date)
                                         AND ${date}::date
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
        dailyEstimate: Number(r.DailyEst),
        actualReception: actual,
        variance: actual - Number(r.DailyEst),
      };
    });

    const weekly = weeklyRows.map((r) => {
      const actual =
        weeklyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      return {
        cropTypeId: r.tbl_CropTypeId,
        crop_type: r.crop_type,
        weeklyEstimate: Number(r.WkToDateEst),
        actualReception: actual,
        variance: actual - Number(r.WkToDateEst),
      };
    });

    const monthly = {};
    const monthKey = new Date(date).toLocaleString("default", {
      month: "long",
    });
    monthly[monthKey] = {};
    monthlyRows.forEach((r) => {
      const actual =
        monthlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      monthly[monthKey][r.crop_type] = {
        estimate: Number(r.MonthToDateEst),
        actual,
        variance: actual - Number(r.MonthToDateEst),
      };
    });

    const yearly = {};
    yearlyRows.forEach((r) => {
      const actual =
        yearlyReception.find((x) => x.cropTypeId === r.tbl_CropTypeId)
          ?.actualReception ?? 0;
      yearly[r.crop_type] = {
        estimate: Number(r.YearToDateEst),
        actual,
        variance: actual - Number(r.YearToDateEst),
      };
    });

    res.json({
      date,
      factoryId,
      factory_name: dailyRows[0]?.factory_name,
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
