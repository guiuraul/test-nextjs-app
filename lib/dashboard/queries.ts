import "server-only";

import { eq, sql } from "drizzle-orm";

import { withUserContext } from "@/lib/db";
import { claimRecords, imports, portfolios } from "@/lib/db/schema";

export type UserWorkspaceStatus = {
  claimCount: number;
  importCount: number;
  portfolioCount: number;
};

function toCount(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getUserWorkspaceStatus(
  userId: string
): Promise<UserWorkspaceStatus> {
  return withUserContext(userId, async (tx) => {
    const [claimsRow] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(claimRecords)
      .where(eq(claimRecords.userId, userId));

    const [importsRow] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(imports)
      .where(eq(imports.userId, userId));

    const [portfoliosRow] = await tx
      .select({ count: sql<number>`count(*)` })
      .from(portfolios)
      .where(eq(portfolios.userId, userId));

    return {
      claimCount: toCount(claimsRow?.count),
      importCount: toCount(importsRow?.count),
      portfolioCount: toCount(portfoliosRow?.count),
    };
  });
}
