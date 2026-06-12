import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardFirstRun } from "@/components/dashboard/dashboard-first-run";
import {
  getPortfolioAnalytics,
  type PortfolioFilterDefinition,
} from "@/lib/portfolio/analytics";
import { getUserWorkspaceStatus } from "@/lib/dashboard/queries";
import { getUserPortfolios } from "@/lib/portfolio/queries";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const workspaceStatus = await getUserWorkspaceStatus(user.id);
  const portfolios = await getUserPortfolios(user.id);

  if (workspaceStatus.claimCount === 0) {
    return (
      <DashboardFirstRun
        signedInEmail={user.email ?? null}
        canGoToPortfolioSetup={workspaceStatus.importCount > 0}
      />
    );
  }

  const serializedPortfolios = portfolios.map((portfolio) => ({
    id: portfolio.id,
    name: portfolio.name,
    description: portfolio.description,
    filters: portfolio.filters as {
      policyState?: string | null;
      insuredSex?: string | null;
      incidentState?: string | null;
      autoMake?: string | null;
      incidentYear?: number | null;
      maxTotalClaimAmount?: number | null;
    },
    createdAt: portfolio.createdAt.toISOString(),
  }));

  const analyticsEntries = await Promise.all(
    portfolios.map(async (portfolio) => [
      portfolio.id,
      await getPortfolioAnalytics(user.id, portfolio.filters as PortfolioFilterDefinition),
    ] as const)
  );

  const analyticsByPortfolioId = Object.fromEntries(analyticsEntries);
  const initialSelectedPortfolioId = portfolios[0]?.id ?? "";

  return (
    <DashboardShell
      portfolios={serializedPortfolios}
      analyticsByPortfolioId={analyticsByPortfolioId}
      initialSelectedPortfolioId={initialSelectedPortfolioId}
      signedInEmail={user.email ?? null}
    />
  );
}
