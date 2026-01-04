import { sql } from "../config/db.js";
import { generateWeeklyPhasing } from "../services/weeklyPhasing.js";

export async function CreateWeeklyPhasing(req, res) {
  const { baseYear } = req.body; //baseyear will come from frontend
  try {
    await generateWeeklyPhasing(baseYear);
    res.status(200).json({ message: "Weekly phasing generated successfully." });
  } catch (error) {
    console.error("Error in CreateWeeklyPhasing:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// controllers/weeklyPhasingController.js
/* export async function getWeeklyPhasing(req, res) {
  try {
    const { year } = req.query; 

    const rows = await sql`
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
        fac."factory_name",
        ct."crop_type"
      FROM "FactWeeklyPhasing" fwp
      INNER JOIN "Factory" fac ON fwp."tbl_FactoryId" = fac."id"
      INNER JOIN "CropType" ct ON fwp."tbl_CropTypeId" = ct."id"
      ${year ? sql`WHERE fwp."BudYear" = ${year}` : sql``}
      ORDER BY fwp."WeekStart" ASC;
    `;

    res.json(rows);
  } catch (err) {
    console.error("Error fetching weekly phasing:", err);
    res.status(500).json({ error: err.message });
  }
}



export async function getDailyPhasing(req, res) {
  try {
    const { year, factoryId, cropTypeId } = req.query; //notice these are parameters from frontend not body

    const rows = await sql`
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
        AND fwp."tbl_CropTypeId" = ${cropTypeId}
      ORDER BY fwp."WeekStart" ASC;
    `;

    res.json(rows);
  } catch (err) {
    console.error("Error fetching daily phasing:", err);
    res.status(500).json({ error: err.message });
  }
}
 */

export async function getDailyEstimate(req, res) {
  try {
    const { year, factoryId, cropTypeId, date } = req.query; // date = '2026-01-03'

    const rows = await sql`
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
        AND fwp."tbl_CropTypeId" = ${cropTypeId}
        AND ${date}::date BETWEEN fwp."WeekStart"::date AND fwp."WeekEnd"::date
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "No estimate found for that date" });
    }

    // Return just the single daily estimate value
    res.json({
      date,
      factoryId,
      cropTypeId,
      dailyEstimate: rows[0].DailyEst,
      factory_name: rows[0].factory_name,
      crop_type: rows[0].crop_type,
    });
  } catch (err) {
    console.error("Error fetching daily estimate:", err);
    res.status(500).json({ error: err.message });
  }
}
