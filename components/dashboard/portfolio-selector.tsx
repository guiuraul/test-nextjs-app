"use client";

import { CalendarDays, ChevronDown, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export type PortfolioSummary = {
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
    filters.maxTotalClaimAmount
      ? `Max claims: ${currencyFormatter.format(filters.maxTotalClaimAmount)}`
      : null,
  ].filter(Boolean) as string[];
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolioId,
  onSelectPortfolioIdAction,
}: {
  portfolios: PortfolioSummary[];
  selectedPortfolioId: string;
  onSelectPortfolioIdAction: (portfolioId: string) => void;
}) {
  const selectedPortfolio =
    portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? portfolios[0];

  if (portfolios.length === 0) {
    return (
      <Card className="overflow-hidden border-dashed border-white/10 bg-slate-950/45 shadow-xl shadow-black/15">
        <CardHeader>
          <CardTitle className="text-base text-white">No saved groups yet</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const chips = getFilterChips(selectedPortfolio.filters);

  return (
    <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45 shadow-xl shadow-black/15">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base text-white">Choose a saved group</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative">
          <select
            id="portfolio-selector"
            value={selectedPortfolio.id}
            onChange={(event) => {
              onSelectPortfolioIdAction(event.target.value);
            }}
            className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/45 px-4 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
          >
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
            <Filter className="h-4 w-4 text-cyan-100" />
            Active filters
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.length > 0 ? (
              chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs text-slate-200"
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
  );
}
