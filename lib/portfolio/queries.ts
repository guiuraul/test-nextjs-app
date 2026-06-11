import "server-only";

import { desc, eq } from "drizzle-orm";

import { withUserContext } from "@/lib/db";
import { portfolios, type PortfolioSelect } from "@/lib/db/schema";

export async function getUserPortfolios(userId: string): Promise<PortfolioSelect[]> {
  return withUserContext(userId, async (tx) =>
    tx
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.createdAt))
  );
}
