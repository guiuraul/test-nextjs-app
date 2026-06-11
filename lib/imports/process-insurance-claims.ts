import "server-only";

import { eq } from "drizzle-orm";

import { parseInsuranceClaimsCsv, toInsuranceClaimImportInput } from "@/lib/csv/insurance-claims";
import { mapInsuranceClaimToInsert } from "@/lib/db/mappers";
import { db } from "@/lib/db";
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
  const rows = parseInsuranceClaimsCsv(csvText);

  const [importRecord] = await db
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
    throw new Error("Unable to create import record.");
  }

  const insertRows = rows.map((row) =>
    mapInsuranceClaimToInsert(toInsuranceClaimImportInput(row), userId, importRecord.id)
  );

  if (insertRows.length > 0) {
    await db.insert(claimRecords).values(insertRows);
  }

  await db
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
}

