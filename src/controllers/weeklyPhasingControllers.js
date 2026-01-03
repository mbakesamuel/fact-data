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
export async function getWeeklyPhasing(req, res) {
  try {
    const { year } = req.query; // optional filter by year

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

