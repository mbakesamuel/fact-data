import { sql } from "../config/db.js";

/* function buildWeeks(finYear) {
  const weeks = [];
  let wkNo = 1;
  const yearEnd = new Date(finYear, 11, 31); // Dec 31

  // Week 1: Jan 1 to first Sunday
  let wkStart = new Date(finYear, 0, 1); // Jan 1
  const weekday = wkStart.getDay(); // Sunday=0, Monday=1, ...
  const daysToSunday = (7 - weekday) % 7; // if Sunday => 0, Thursday => 3
  let wkEnd = new Date(wkStart);
  wkEnd.setDate(wkStart.getDate() + daysToSunday);
  if (wkEnd > yearEnd) wkEnd = yearEnd;

  weeks.push({ wkNo, wkStart, wkEnd });
  wkNo++;

  // Subsequent weeks: Monday–Sunday
  wkStart = new Date(wkEnd);
  wkStart.setDate(wkEnd.getDate() + 1); // next day
  while (wkStart <= yearEnd) {
    wkEnd = new Date(wkStart);
    wkEnd.setDate(wkStart.getDate() + 6);
    if (wkEnd > yearEnd) wkEnd = yearEnd;

    weeks.push({ wkNo, wkStart, wkEnd });
    wkNo++;
    wkStart = new Date(wkEnd);
    wkStart.setDate(wkEnd.getDate() + 1);
  }

  return weeks;
} */

function buildWeeks(finYear) {
  const weeks = [];
  let wkNo = 1;
  const yearEnd = new Date(finYear, 11, 31);

  // Start Jan 1
  let wkStart = new Date(finYear, 0, 1);

  // First week: Jan 1 → first Sunday
  let wkEnd = new Date(wkStart);
  while (wkEnd.getDay() !== 0 && wkEnd < yearEnd) {
    wkEnd.setDate(wkEnd.getDate() + 1);
  }
  weeks.push({ wkNo, wkStart, wkEnd });
  wkNo++;

  // Subsequent weeks: Monday–Sunday
  wkStart = new Date(wkEnd);
  wkStart.setDate(wkEnd.getDate() + 1);
  while (wkStart <= yearEnd) {
    wkEnd = new Date(wkStart);
    wkEnd.setDate(wkStart.getDate() + 6);
    if (wkEnd > yearEnd) wkEnd = yearEnd;

    weeks.push({ wkNo, wkStart, wkEnd });
    wkNo++;

    wkStart = new Date(wkEnd);
    wkStart.setDate(wkEnd.getDate() + 1);
  }

  return weeks;
}

export async function generateWeeklyPhasing(finYear) {
  try {
    // Clear previous weekly phasing
    await sql`
      DELETE FROM "FactWeeklyPhasing"
      WHERE "BudYear" = ${finYear};
    `;

    // Monthly source
    const monthlyRows = await sql`
      SELECT "tbl_FactoryID", "tbl_CropTypeID", "effDate", SUM("monthEst") AS "monthEst"
      FROM "ProcEstMonthlyPhasing"
      WHERE EXTRACT(YEAR FROM "effDate") = ${finYear}
      GROUP BY "tbl_FactoryID", "tbl_CropTypeID", "effDate";
    `;

    const weeks = buildWeeks(finYear);

    for (const m of monthlyRows) {
      const monthStart = new Date(m.effDate);
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
      );
      const daysInMonth = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1;
      const period = monthStart.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      let totalAllocated = 0;
      let lastWeekNo = 0;

      for (const w of weeks) {
        const overlapStart = w.wkStart < monthStart ? monthStart : w.wkStart;
        const overlapEnd = w.wkEnd > monthEnd ? monthEnd : w.wkEnd;

        if (overlapEnd >= overlapStart) {
          const overlapDays =
            (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24) + 1;
          const wkEst =
            Math.round((m.monthEst / daysInMonth) * overlapDays * 100) / 100;
          totalAllocated += wkEst;
          lastWeekNo = w.wkNo;

          await sql`
            INSERT INTO "FactWeeklyPhasing"
              ("BudYear","Period","tbl_FactoryId","tbl_CropTypeId","weekNo","WeekStart","WeekEnd","DaysAllocated","WkEst")
            VALUES (${finYear}, ${period}, ${m.tbl_FactoryID}, ${m.tbl_CropTypeID}, ${w.wkNo}, ${overlapStart}, ${overlapEnd}, ${overlapDays}, ${wkEst});
          `;
        }
      }

      // Reconcile adjustment
      const adjustment = m.monthEst - Math.round(totalAllocated * 100) / 100;
      if (Math.abs(adjustment) > 0.01 && lastWeekNo > 0) {
        await sql`
          UPDATE "FactWeeklyPhasing"
          SET "WkEst" = "WkEst" + ${Math.round(adjustment * 100) / 100}
          WHERE "BudYear" = ${finYear}
            AND "Period" = ${period}
            AND "weekNo" = ${lastWeekNo}
            AND "tbl_FactoryId" = ${m.tbl_FactoryID}
            AND "tbl_CropTypeId" = ${m.tbl_CropTypeID};
        `;
      }
    }

    console.log("✅ Weekly phasing generated successfully.");
  } catch (err) {
    console.error("❌ Error generating weekly phasing:", err);
    throw err;
  }
}
