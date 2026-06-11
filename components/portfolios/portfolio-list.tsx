import { CalendarDays, Filter, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioSelect } from "@/lib/db/schema";

function formatCriteria(portfolio: PortfolioSelect) {
  const filters = portfolio.filters as {
    policyState?: string | null;
    insuredSex?: string | null;
    incidentState?: string | null;
    autoMake?: string | null;
    incidentYear?: number | null;
    maxTotalClaimAmount?: number | null;
  };

  const parts = [
    filters.policyState ? `Policy state: ${filters.policyState}` : null,
    filters.insuredSex ? `Gender: ${filters.insuredSex}` : null,
    filters.incidentState ? `Incident state: ${filters.incidentState}` : null,
    filters.autoMake ? `Make: ${filters.autoMake}` : null,
    filters.incidentYear ? `Year: ${filters.incidentYear}` : null,
    filters.maxTotalClaimAmount ? `Max claims: $${filters.maxTotalClaimAmount}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "No filters set yet";
}

export function PortfolioList({ portfolios }: { portfolios: PortfolioSelect[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <ShieldCheck className="h-4 w-4 text-cyan-100" />
        Saved portfolios ready for dashboard selection
      </div>

      {portfolios.length === 0 ? (
        <Card className="border-dashed border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-base">No portfolios yet</CardTitle>
            <CardDescription>
              Create your first portfolio above and it will appear here with its saved filters.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="bg-white/6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{portfolio.name}</CardTitle>
                    <CardDescription>{portfolio.description ?? "Saved portfolio"}</CardDescription>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Ready
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-cyan-100" />
                  {formatCriteria(portfolio)}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Created {portfolio.createdAt.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

