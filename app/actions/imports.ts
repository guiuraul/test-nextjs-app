"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ImportActionState } from "@/app/actions/imports-state";
import { initialImportActionState } from "@/app/actions/imports-state";
import { InsuranceClaimsCsvValidationError } from "@/lib/csv/insurance-claims";
import { getCurrentUser } from "@/lib/supabase/server";
import { processInsuranceClaimsCsv } from "@/lib/imports/process-insurance-claims";

export async function importInsuranceClaimsAction(
  prevState: ImportActionState = initialImportActionState,
  formData: FormData
): Promise<ImportActionState> {
  void prevState;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return {
      status: "error",
      message: "Please choose a CSV file to import.",
    };
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return {
      status: "error",
      message: "Only CSV files are supported.",
    };
  }

  try {
    const csvText = await file.text();
    console.log("[imports] action received file", {
      userId: user.id,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });

    const result = await processInsuranceClaimsCsv({
      csvText,
      userId: user.id,
      fileName: file.name,
    });

    revalidatePath("/dashboard");
    revalidatePath("/imports");

    return {
      status: "success",
      message: `Imported ${result.insertedRows} rows from ${file.name}.`,
    };
  } catch (error) {
    console.error("[imports] import failed", error);

    if (error instanceof InsuranceClaimsCsvValidationError) {
      return {
        status: "error",
        message: error.message,
        details: error.details,
      };
    }

    return {
      status: "error",
      message:
        "Import failed on the server. Check the terminal logs for the exact database error.",
    };
  }
}
