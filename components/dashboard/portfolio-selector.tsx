"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BarChart3, CalendarDays, ChevronDown, Filter, PieChart, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PortfolioSummary = {
  id: string;
  name: string;
  description: string | null;
  filters: {
    policyState?: string | null;
    insuredSex?: string | null;
    incidentState?: string | null;
    autoMake?: string | null;
    incidentYear?: number | null;
    maxTotalClaimAmount?: number | null;
  };
  createdAt: string;
};

function getFilterChips(filters: PortfolioSummary["filters"]) {
  return [
    filters.policyState ? `Policy state: ${filters.policyState}` : null,
    filters.insuredSex ? `Gender: ${filters.insuredSex}` : null,
    filters.incidentState ? `Incident state: ${filters.incidentState}` : null,
    filters.autoMake ? `Make: ${filters.autoMake}` : null,
    filters.incidentYear ? `Year: ${filters.incidentYear}` : null,
    filters.maxTotalClaimAmount ? `Max claims: $${filters.maxTotalClaimAmount}` : null,
  ].filter(Boolean) as string[];
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolioId,
}: {
  portfolios: PortfolioSummary[];
  selectedPortfolioId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedPortfolio =
    portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? portfolios[0];

  if (portfolios.length === 0) {
    return (
      <Card className="border-dashed border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-base">No saved portfolios yet</CardTitle>
          <CardDescription>
            Create a portfolio first. Once one is saved, it will appear here and drive the
            dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chips = getFilterChips(selectedPortfolio.filters);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-white/10 bg-white/6">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Portfolio selector</CardTitle>
              <CardDescription>
                Pick one saved portfolio and the dashboard updates instantly.
              </CardDescription>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="portfolio-selector" className="text-sm font-medium text-slate-200">
              Saved portfolios
            </label>
            <select
              id="portfolio-selector"
              value={selectedPortfolio.id}
              onChange={(event) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("portfolio", event.target.value);
                router.replace(`${pathname}?${params.toString()}`);
              }}
              className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
            >
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolios</p>
              <p className="mt-2 text-lg font-semibold text-white">{portfolios.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected</p>
              <p className="mt-2 text-lg font-semibold text-white">{selectedPortfolio.name}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
              <p className="mt-2 text-lg font-semibold text-emerald-300">Ready</p>
            </div>
          </div>

          <Button type="button" variant="secondary" className="w-full">
            <Filter className="h-4 w-4" />
            Use selected portfolio
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45">
        <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
        <CardHeader>
          <CardTitle className="text-base">{selectedPortfolio.name}</CardTitle>
          <CardDescription>
            {selectedPortfolio.description ?? "Saved portfolio definition ready for analytics."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BarChart3 className="h-4 w-4 text-cyan-100" />
                Claims by year
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                This will render after we wire the analytics query for the selected portfolio.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <PieChart className="h-4 w-4 text-cyan-100" />
                Distribution
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Gender, state, and make breakdowns will use the same selection.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="h-4 w-4 text-cyan-100" />
                Totals
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Aggregate claim values will be computed from the selected portfolio filters.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Filter className="h-4 w-4 text-cyan-100" />
              Active filters
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.length > 0 ? (
                chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {chip}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">No filters set yet.</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Saved {new Date(selectedPortfolio.createdAt).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
