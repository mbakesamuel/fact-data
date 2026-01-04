/* 
// controllers/phasingController.js
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
    const { year, factoryId, date } = req.query; // date = '2026-01-03'

    // --- Daily + Weekly from FactWeeklyPhasing ---
    const weeklyRows = await sql`
      SELECT 
        fwp."id",
        fwp."BudYear",
        fwp."Period",
        fwp."WeekStart",
        fwp."WeekEnd",
        fwp."DaysAllocated",
        fwp."tbl_FactoryId",
        fwp."tbl_CropTypeId",
        fwp."weekNo",
        fwp."WkEst",
        (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "DailyEst",
        fac."factory_name",
        ct."crop_type"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "Factory" fac ON fwp."tbl_FactoryId" = fac."id"
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date
      ORDER BY ct."crop_type";
    `;

    // --- Monthly + Yearly from ProcEstMonthlyPhasing ---
    const monthlyRows = await sql`
      SELECT 
        p."tbl_FactoryID",
        p."tbl_CropTypeID",
        p."effDate",
        p."monthEst",
        fac."factory_name",
        ct."crop_type"
      FROM "ProcEstMonthlyPhasing" p
      INNER JOIN "Factory" fac ON p."tbl_FactoryID" = fac."id"
      INNER JOIN "CropType" ct ON p."tbl_CropTypeID" = ct."id"
      WHERE EXTRACT(YEAR FROM p."effDate") = ${year}
        AND p."tbl_FactoryID" = ${factoryId}
      ORDER BY p."effDate";
    `;

    if (weeklyRows.length === 0 && monthlyRows.length === 0) {
      return res.status(404).json({ error: "No estimates found" });
    }

    // Group monthly by month name
    const monthly = monthlyRows.reduce((acc, r) => {
      const monthKey = new Date(r.effDate).toLocaleString("default", {
        month: "long",
      });
      acc[monthKey] = acc[monthKey] || {};
      acc[monthKey][r.crop_type] =
        (acc[monthKey][r.crop_type] ?? 0) + Number(r.monthEst);
      return acc;
    }, {});

    // Yearly totals
    const yearly = monthlyRows.reduce((acc, r) => {
      acc[r.crop_type] = (acc[r.crop_type] ?? 0) + Number(r.monthEst);
      return acc;
    }, {});

    res.json({
      date,
      factoryId,
      factory_name: weeklyRows[0]?.factory_name || monthlyRows[0]?.factory_name,
      estimates: {
        daily: weeklyRows.map((r) => ({
          cropTypeId: r.tbl_CropTypeId,
          crop_type: r.crop_type,
          dailyEstimate: r.DailyEst,
        })),
        weekly: weeklyRows.map((r) => ({
          cropTypeId: r.tbl_CropTypeId,
          crop_type: r.crop_type,
          weeklyEstimate: r.WkEst,
          weekNo: r.weekNo,
          period: r.Period,
        })),
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

// controllers/phasingController.js
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
    const { year, factoryId, date } = req.query; // date = '2026-01-03'

    // --- Daily + Weekly from FactWeeklyPhasing ---
    const weeklyRows = await sql`
      SELECT 
        fwp."id",
        fwp."BudYear",
        fwp."Period",
        fwp."WeekStart",
        fwp."WeekEnd",
        fwp."DaysAllocated",
        fwp."tbl_FactoryId",
        fwp."tbl_CropTypeId",
        fwp."weekNo",
        fwp."WkEst",
        (fwp."WkEst" / NULLIF(fwp."DaysAllocated",0)) AS "DailyEst",
        fac."factory_name",
        ct."crop_type"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "Factory" fac ON fwp."tbl_FactoryId" = fac."id"
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      WHERE fwp."BudYear" = ${year}
        AND fwp."tbl_FactoryId" = ${factoryId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date
      ORDER BY ct."crop_type";
    `;

    // --- Monthly + Yearly from ProcEstMonthlyPhasing ---
    const monthlyRows = await sql`
      SELECT 
        p."tbl_FactoryID",
        p."tbl_CropTypeID",
        p."effDate",
        p."monthEst",
        fac."factory_name",
        ct."crop_type"
      FROM "ProcEstMonthlyPhasing" p
      INNER JOIN "Factory" fac ON p."tbl_FactoryID" = fac."id"
      INNER JOIN "CropType" ct ON p."tbl_CropTypeID" = ct."id"
      WHERE EXTRACT(YEAR FROM p."effDate") = ${year}
        AND p."tbl_FactoryID" = ${factoryId}
      ORDER BY p."effDate";
    `;

    // --- Actuals from Reception table for variance ---
    const receptionRows = await sql`
       SELECT 
    r."factory_id",
    r."field_grade_id" AS "cropTypeId",
    r."operation_date"::date AS "effDate",
    SUM(r."qty_crop") AS "actualReception"
  FROM "CropReception" r
  WHERE r."factory_id" = ${factoryId}
    AND EXTRACT(YEAR FROM r."operation_date") = ${year}
  GROUP BY r."factory_id", r."field_grade_id", r."operation_date";
    `;

    if (weeklyRows.length === 0 && monthlyRows.length === 0) {
      return res.status(404).json({ error: "No estimates found" });
    }

    // --- Monthly aggregation with variance ---
    const monthly = {};
    monthlyRows.forEach((r) => {
      const monthKey = new Date(r.effDate).toLocaleString("default", {
        month: "long",
      });
      monthly[monthKey] = monthly[monthKey] || {};
      const estimate = Number(r.monthEst);

      // actuals for that month/crop type
      const actual = receptionRows
        .filter(
          (x) =>
            x.tbl_CropTypeId === r.tbl_CropTypeID &&
            new Date(x.effDate).getMonth() === new Date(r.effDate).getMonth()
        )
        .reduce((sum, x) => sum + Number(x.actualReception), 0);

      monthly[monthKey][r.crop_type] = {
        estimate,
        actual,
        variance: actual - estimate,
      };
    });

    // --- Yearly totals with variance ---
    const yearly = {};
    monthlyRows.forEach((r) => {
      const estimate = Number(r.monthEst);
      yearly[r.crop_type] = yearly[r.crop_type] || {
        estimate: 0,
        actual: 0,
        variance: 0,
      };
      yearly[r.crop_type].estimate += estimate;

      // actuals for that crop type across year
      const actual = receptionRows
        .filter((x) => x.tbl_CropTypeId === r.tbl_CropTypeID)
        .reduce((sum, x) => sum + Number(x.actualReception), 0);

      yearly[r.crop_type].actual = actual;
      yearly[r.crop_type].variance =
        yearly[r.crop_type].actual - yearly[r.crop_type].estimate;
    });

    // --- Daily + Weekly variance ---
    const actualMap = {};
    receptionRows.forEach((r) => {
      const key = `${r.tbl_CropTypeId}-${
        r.effDate.toISOString().split("T")[0]
      }`;
      actualMap[key] = Number(r.actualReception);
    });

    res.json({
      date,
      factoryId,
      factory_name: weeklyRows[0]?.factory_name || monthlyRows[0]?.factory_name,
      estimates: {
        daily: weeklyRows.map((r) => {
          const key = `${r.tbl_CropTypeId}-${date}`;
          const actual = actualMap[key] ?? 0;
          return {
            cropTypeId: r.tbl_CropTypeId,
            crop_type: r.crop_type,
            dailyEstimate: r.DailyEst,
            actualReception: actual,
            variance: actual - r.DailyEst,
          };
        }),
        weekly: weeklyRows.map((r) => {
          const actual = receptionRows
            .filter(
              (x) =>
                x.tbl_CropTypeId === r.tbl_CropTypeId &&
                new Date(x.effDate) >= new Date(r.WeekStart) &&
                new Date(x.effDate) <= new Date(r.WeekEnd)
            )
            .reduce((sum, x) => sum + Number(x.actualReception), 0);
          return {
            cropTypeId: r.tbl_CropTypeId,
            crop_type: r.crop_type,
            weeklyEstimate: r.WkEst,
            actualReception: actual,
            variance: actual - r.WkEst,
            weekNo: r.weekNo,
            period: r.Period,
          };
        }),
        monthly,
        yearly,
      },
    });
  } catch (err) {
    console.error("Error fetching phasing estimates:", err);
    res.status(500).json({ error: err.message });
  }
}
