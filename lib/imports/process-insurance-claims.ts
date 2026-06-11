import "server-only";

import { eq } from "drizzle-orm";

import { parseInsuranceClaimsCsv, toInsuranceClaimImportInput } from "@/lib/csv/insurance-claims";
import { mapInsuranceClaimToInsert } from "@/lib/db/mappers";
import { withUserContext } from "@/lib/db";
import { claimRecords, imports } from "@/lib/db/schema";

export type ProcessInsuranceClaimsResult = {
  importId: string;
  totalRows: number;
  insertedRows: number;
};

export async function processInsuranceClaimsCsv({
  csvText,
  userId,
  fileName,
}: {
  csvText: string;
  userId: string;
  fileName: string;
}): Promise<ProcessInsuranceClaimsResult> {
  console.log("[imports] start", {
    userId,
    fileName,
    csvLength: csvText.length,
  });

  const rows = parseInsuranceClaimsCsv(csvText);
  console.log("[imports] parsed rows", {
    rowCount: rows.length,
    sample: rows[0]
      ? {
          auto_make: rows[0].auto_make,
          auto_model: rows[0].auto_model,
          _c39: rows[0]._c39,
        }
      : null,
  });

  const result = await withUserContext(userId, async (tx) => {
    console.log("[imports] inserting import record");
    const [importRecord] = await tx
      .insert(imports)
      .values({
        userId,
        fileName,
        status: "processing",
        totalRows: rows.length,
        processedRows: 0,
        failedRows: 0,
      })
      .returning({ id: imports.id });

    if (!importRecord) {
      console.error("[imports] import record insert returned no row");
      throw new Error("Unable to create import record.");
    }

    console.log("[imports] import record created", {
      importId: importRecord.id,
    });

    const insertRows = rows.map((row) =>
      mapInsuranceClaimToInsert(toInsuranceClaimImportInput(row), userId, importRecord.id)
    );

    if (insertRows.length > 0) {
      console.log("[imports] inserting claim records", {
        insertCount: insertRows.length,
      });
      await tx.insert(claimRecords).values(insertRows);
    }

    console.log("[imports] updating import status to completed");
    await tx
      .update(imports)
      .set({
        status: "completed",
        processedRows: rows.length,
        failedRows: 0,
      })
      .where(eq(imports.id, importRecord.id));

    return {
      importId: importRecord.id,
      totalRows: rows.length,
      insertedRows: insertRows.length,
    };
  });

  return result;
}
