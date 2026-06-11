import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, DatabaseZap, LockKeyhole } from "lucide-react";

import { PortfolioAnalyticsPanel } from "@/components/dashboard/portfolio-analytics";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { PortfolioSelector } from "@/components/dashboard/portfolio-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPortfolioAnalytics, type PortfolioFilterDefinition } from "@/lib/portfolio/analytics";
import { getUserPortfolios } from "@/lib/portfolio/queries";
import { getCurrentUser } from "@/lib/supabase/server";

const metrics = [
  {
    title: "Private account",
    value: "1 user = 1 workspace",
    icon: LockKeyhole,
  },
  {
    title: "Ready for imports",
    value: "CSV ingestion comes next",
    icon: DatabaseZap,
  },
  {
    title: "Dashboard shell",
    value: "Charts and filters will plug in here",
    icon: BarChart3,
  },
];

type DashboardSearchParams = Promise<{
  portfolio?: string;
}>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: DashboardSearchParams;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const portfolios = await getUserPortfolios(user.id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedPortfolioId =
    resolvedSearchParams.portfolio && portfolios.some((portfolio) => portfolio.id === resolvedSearchParams.portfolio)
      ? resolvedSearchParams.portfolio
      : portfolios[0]?.id ?? "";
  const selectedPortfolio = portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? portfolios[0];
  const analytics = selectedPortfolio
    ? await getPortfolioAnalytics(user.id, selectedPortfolio.filters as PortfolioFilterDefinition)
    : null;

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

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-cyan-100 uppercase">
              Authenticated space
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Welcome, {user.email ?? "user"}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              The first vertical slice is live: secure sign up, login, and age validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 md:block">
              Next: CSV import and portfolio rules
            </div>
            <Link
              href="/imports"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              Import CSV
            </Link>
            <Link
              href="/portfolio-setup"
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-4 py-3 text-sm text-white transition hover:bg-cyan-300/20"
            >
              New portfolio
            </Link>
            <SignOutForm />
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card key={metric.title} className="bg-white/6">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{metric.value}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="space-y-6">
            <PortfolioSelector
              portfolios={serializedPortfolios}
              selectedPortfolioId={selectedPortfolioId}
            />
            {selectedPortfolio ? (
              <PortfolioAnalyticsPanel portfolio={selectedPortfolio} analytics={analytics} />
            ) : null}
            <Card className="overflow-hidden border-emerald-300/15 bg-slate-950/45">
              <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
              <CardHeader>
                <CardTitle>What the dashboard will do next</CardTitle>
                <CardDescription>
                  We now have the saved portfolio source wired in and the dashboard is showing real
                  claim totals for the selected portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-50">Portfolio source</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    The dashboard reads the portfolio records saved in Supabase and can switch
                    between them instantly.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-50">Next analytics step</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    We can now refine the queries and add richer chart components if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
