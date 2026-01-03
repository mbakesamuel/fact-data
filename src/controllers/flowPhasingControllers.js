import { sql } from "../config/db.js";

import { flowPhasing } from "../services/flowPhasing.js";

export async function createFlowPhasing(req, res) {
  const { baseYear } = req.body;

  try {
    await flowPhasing(Number(baseYear));
    res
      .status(200)
      .json({ message: "Factory flow phasing generated successfully." });
  } catch (err) {
    console.error("Error in factory flow phasing:", err);
    res.status(500).json({ error: err.message });
  }
}

// get factory flow phasing
export async function getFlowPhasing(req, res) {
  try {
    const rows = await sql`
      SELECT 
        pmp."id",
        pmp."effDate",
        pmp."monthEst",
        f.id AS factoryId,
        f."factory_name",
        ct.id As cropTypeId,
        ct."crop_type",
        cc."budYear",
        cc."id" AS cropCollectionId
      FROM "ProcEstMonthlyPhasing" pmp
      INNER JOIN "Factory" f
        ON pmp."tbl_FactoryID" = f."id"
      INNER JOIN "CropType" ct
        ON pmp."tbl_CropTypeID" = ct."id"
      INNER JOIN "CropCollection" cc
        ON pmp."tbl_CropCollectionId" = cc."id"
      ORDER BY pmp."effDate" ASC;
    `;

    res.json(rows);
  } catch (err) {
    console.error("Error in getFlowPhasing:", err);
    throw err;
  }
}
