import { sql } from "../config/db.js";

//get all receptions
export const getAllCropSupplyUnit = async (req, res) => {
  try {
    const rows = await sql`
      SELECT 
        "CropSupplyUnit".id AS crop_supply_unit_id,
        "SubUnit".sub_unit AS sub_unit,
        "Estate".name AS estate      
      FROM "CropSupplyUnit"
      INNER JOIN "Estate"
        ON "CropSupplyUnit".estate_id = "Estate".id
      INNER JOIN "SubUnit"
        ON "CropSupplyUnit".sub_unit_id = "SubUnit".id;
    `;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCropSupplyUnitById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await sql`SELECT 
        "CropSupplyUnit".id AS crop_supply_unit_id,
        "Estate".name AS estate
      FROM "CropSupplyUnit"
      INNER JOIN "Estate"
        ON "CropSupplyUnit".estate_id = "Estate".id 
      WHERE id = ${id}`;
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

export const deleteReception = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] =
      await sql`DELETE FROM "CropReception" WHERE id = ${id} RETURNING *`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully", deleted: row });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */
