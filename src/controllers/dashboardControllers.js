import { sql } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  const { factory_id } = req.query;

  try {
    // Today’s date
    const today = new Date().toISOString().split("T")[0];

    // Today’s receptions
    const [{ count: todayReceptions }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM "CropReception"
      WHERE DATE(operation_date) = ${today}
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    // Today’s processed
    const [{ count: todayProcessed }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM "CropProcessing"
      WHERE DATE(operation_date) = ${today}
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    // Totals
    const [{ count: totalReceptions, qty: totalQuantityReceived }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_crop),0)::float AS qty
      FROM "CropReception"
      ${factory_id ? sql`WHERE factory_id = ${factory_id}` : sql``}
    `;

    const [{ count: totalProcessed, qty: totalQuantityProcessed }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_proc),0)::float AS qty
      FROM "CropProcessing"
      ${factory_id ? sql`WHERE factory_id = ${factory_id}` : sql``}
    `;

    res.json({
      todayReceptions,
      todayProcessed,
      totalReceptions,
      totalProcessed,
      totalQuantityReceived,
      totalQuantityProcessed,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
