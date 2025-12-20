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

    // Month-to-date receptions
    const [{ count: monthReceptions, qty: monthQuantityReceived }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_crop),0)::float AS qty
      FROM "CropReception"
      WHERE EXTRACT(MONTH FROM operation_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM operation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    // Month-to-date processed
    const [{ count: monthProcessed, qty: monthQuantityProcessed }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_proc),0)::float AS qty
      FROM "CropProcessing"
      WHERE EXTRACT(MONTH FROM operation_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM operation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    // Year-to-date receptions
    const [{ count: yearReceptions, qty: yearQuantityReceived }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_crop),0)::float AS qty
      FROM "CropReception"
      WHERE EXTRACT(YEAR FROM operation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    // Year-to-date processed
    const [{ count: yearProcessed, qty: yearQuantityProcessed }] = await sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(qty_proc),0)::float AS qty
      FROM "CropProcessing"
      WHERE EXTRACT(YEAR FROM operation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      ${factory_id ? sql`AND factory_id = ${factory_id}` : sql``}
    `;

    res.json({
      todayReceptions,
      todayProcessed,
      totalReceptions,
      totalProcessed,
      totalQuantityReceived,
      totalQuantityProcessed,
      monthReceptions,
      monthProcessed,
      monthQuantityReceived,
      monthQuantityProcessed,
      yearReceptions,
      yearProcessed,
      yearQuantityReceived,
      yearQuantityProcessed,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
