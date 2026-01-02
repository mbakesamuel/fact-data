import { sql } from "../config/db.js";

// Get all crop processings:exceptionally filter by factory
/* export const getAllProcessing = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let rows;
    if (factoryId) {
      rows =
        await sql`SELECT * FROM "CropProcessing" WHERE factory_id = ${Number(
          factoryId
        )};`;
    } else {
      rows = await sql`SELECT * FROM "CropProcessing";`;
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

export const getAllProcessing = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let rows;

    if (factoryId) {
      rows = await sql`
        SELECT 
          cp.*,
          f.id   AS factory_id,
          f.factory_name AS factory_name,
          fs.id  AS process_grade_id,
          fs.crop AS process_grade_name
        FROM "CropProcessing" cp
        JOIN "Factory" f ON cp.factory_id = f.id
        JOIN "FieldSupply" fs ON cp.process_grade_id = fs.id
        WHERE cp.factory_id = ${Number(factoryId)};
      `;
    } else {
      rows = await sql`
        SELECT 
          cp.*,
          f.id   AS factory_id,
          f.factory_name AS factory_name,
          fs.id  AS process_grade_id,
          fs.crop AS process_grade_name
        FROM "CropProcessing" cp
        JOIN "Factory" f ON cp.factory_id = f.id
        JOIN "FieldSupply" fs ON cp.process_grade_id = fs.id;
      `;
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single crop processing by ID
export const getProcessingById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await sql`SELECT * FROM "CropProcessing" WHERE id = ${id}`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new crop processing
export const createProcessing = async (req, res) => {
  const { operation_date, factory_id, process_grade_id, qty_proc, user_id } =
    req.body;
  try {
    const [row] = await sql`
      INSERT INTO "CropProcessing" (operation_date, factory_id, process_grade_id, qty_proc, user_id)
      VALUES (${operation_date}, ${factory_id}, ${process_grade_id}, ${qty_proc}, ${user_id})
      RETURNING *
    `;
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a crop processing
export const updateProcessing = async (req, res) => {
  const { id } = req.params;
  const { operation_date, factory_id, process_grade_id, qty_proc, user_id } =
    req.body;
  try {
    const [row] = await sql`
      UPDATE "CropProcessing"
      SET operation_date = ${operation_date},
          factory_id = ${factory_id},
          process_grade_id = ${process_grade_id},
          qty_proc = ${qty_proc},
          user_id = ${user_id}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a crop processing
export const deleteProcessing = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] =
      await sql`DELETE FROM "CropProcessing" WHERE id = ${id} RETURNING *`;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully", deleted: row });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
