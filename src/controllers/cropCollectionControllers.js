import { sql } from "../config/db.js";

//get crop reception by Factory
export const getAllCropCollection = async (req, res) => {
  try {
    const rows = await sql`
      SELECT 
        cc.*,
        csu.*,
        e."name" AS estate_name,
        su."sub_unit" AS sub_unit,
        (e."name" || ' - ' || su."sub_unit") AS estate_subunit
      FROM "CropCollection" cc
      INNER JOIN "CropSupplyUnit" csu
        ON cc."cropSupplyUnitId" = csu."id"
      INNER JOIN "Estate" e
        ON csu."estate_id" = e."id"
      INNER JOIN "SubUnit" su
        ON csu."sub_unit_id" = su."id"
    `;

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCropCollectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await sql`  SELECT 
        cc.*,
        csu.*,
        e."name" AS estate_name,
        su."sub_unit" AS sub_unit,
        (e."name" || ' - ' || su."sub_unit") AS estate_subunit
      FROM "CropCollection" cc
      INNER JOIN "CropSupplyUnit" csu
        ON cc."cropSupplyUnitId" = csu."id"
      INNER JOIN "Estate" e
        ON csu."estate_id" = e."id"
      INNER JOIN "SubUnit" su
        ON csu."sub_unit_id" = su."id"
    WHERE cc."id" = ${id}`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* export const createReception = async (req, res) => {
  const {
    operation_date,
    factory_id,
    field_grade_id,
    supply_unit_id,
    qty_crop,
    user_id,
  } = req.body;
  try {
    const [row] = await sql`
  INSERT INTO "CropReception" (operation_date, factory_id, field_grade_id, supply_unit_id, qty_crop, user_id)
  VALUES (${operation_date}, ${factory_id}, ${field_grade_id}, ${supply_unit_id}, ${qty_crop}, ${user_id})
  RETURNING *
`;
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReception = async (req, res) => {
  const { id } = req.params;
  const {
    operation_date,
    factory_id,
    field_grade_id,
    supply_unit_id,
    qty_crop,
  } = req.body;
  try {
    const [row] = await sql`
      UPDATE "CropReception"
      SET operation_date = ${operation_date},
          factory_id = ${factory_id},
          field_grade_id = ${field_grade_id},
          supply_unit_id = ${supply_unit_id},
          qty_crop = ${qty_crop}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */
export const deleteCropCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] =
      await sql`DELETE FROM "crop_collection" WHERE id = ${id} RETURNING *`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully", deleted: row });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
