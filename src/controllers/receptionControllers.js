import { sql } from "../config/db.js";

//get crop reception by Factory
/* export const getAllReceptions = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let rows;

    if (factoryId) {
      rows =
        await sql`SELECT * FROM "CropReception" WHERE factory_id = ${factoryId}`;
    } else {
      rows = await sql`SELECT * FROM "CropReception"`;
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */
export const getAllReceptions = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let rows;

    if (factoryId) {
      rows = await sql`
        SELECT 
          cr.*,
          f.id AS factory_id,
          f.factory_name AS factory_name,
          fs.id AS field_grade_id,
          fs.crop AS field_grade_name
        FROM "CropReception" cr
        JOIN "Factory" f ON cr.factory_id = f.id
        JOIN "FieldSupply" fs ON cr.field_grade_id = fs.id
        WHERE cr.factory_id = ${factoryId};
      `;
    } else {
      rows = await sql`
        SELECT 
          cr.*,
          f.id AS factory_id,
          f.factory_name AS factory_name,
          fs.id AS field_grade_id,
          fs.crop AS field_grade_name
        FROM "CropReception" cr
        JOIN "Factory" f ON cr.factory_id = f.id
        JOIN "FieldSupply" fs ON cr.field_grade_id = fs.id;
      `;
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReceptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await sql`SELECT * FROM "CropReception" WHERE id = ${id}`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReception = async (req, res) => {
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
