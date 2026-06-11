"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { PortfolioActionState } from "@/app/actions/portfolios-state";
import { initialPortfolioActionState } from "@/app/actions/portfolios-state";
import { withUserContext } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/supabase/server";

const portfolioSchema = z.object({
  name: z.string().trim().min(2, "Portfolio name must be at least 2 characters."),
  policyState: z.string().trim().optional(),
  insuredSex: z.string().trim().optional(),
  incidentState: z.string().trim().optional(),
  autoMake: z.string().trim().optional(),
  incidentYear: z.string().trim().optional(),
  maxTotalClaimAmount: z.string().trim().optional(),
});

export async function createPortfolioAction(
  prevState: PortfolioActionState = initialPortfolioActionState,
  formData: FormData
): Promise<PortfolioActionState> {
  void prevState;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const parsed = portfolioSchema.safeParse({
    name: formData.get("name"),
    policyState: formData.get("policyState"),
    insuredSex: formData.get("insuredSex"),
    incidentState: formData.get("incidentState"),
    autoMake: formData.get("autoMake"),
    incidentYear: formData.get("incidentYear"),
    maxTotalClaimAmount: formData.get("maxTotalClaimAmount"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the highlighted portfolio fields.",
      fieldErrors: {
        name: fieldErrors.name,
        criteria: fieldErrors.policyState ?? fieldErrors.insuredSex ?? fieldErrors.incidentState,
      },
    };
  }

  const filters = {
    policyState: parsed.data.policyState || null,
    insuredSex: parsed.data.insuredSex || null,
    incidentState: parsed.data.incidentState || null,
    autoMake: parsed.data.autoMake || null,
    incidentYear: parsed.data.incidentYear ? Number(parsed.data.incidentYear) : null,
    maxTotalClaimAmount: parsed.data.maxTotalClaimAmount
      ? Number(parsed.data.maxTotalClaimAmount)
      : null,
  };

  await withUserContext(user.id, async (tx) => {
    await tx.insert(portfolios).values({
      userId: user.id,
      name: parsed.data.name,
      description: "Saved insurance claim portfolio",
      filters,
    });
  });

  revalidatePath("/portfolio-setup");
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Portfolio saved successfully.",
  };
}
