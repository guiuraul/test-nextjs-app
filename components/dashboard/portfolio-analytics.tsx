"use client";

import type { ComponentType } from "react";
import { ArrowUpRight, BadgeDollarSign, CalendarRange, ChartColumn, MapPinned, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioAnalytics } from "@/lib/portfolio/analytics";
import type { PortfolioSelect } from "@/lib/db/schema";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMaxValue(items: Array<{ value: number }>) {
  return Math.max(...items.map((item) => item.value), 1);
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function BarSeries({
  items,
  emptyLabel,
}: {
  items: Array<{ label: string; value: number }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }

  const maxValue = getMaxValue(items);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
            <span className="truncate">{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AreaChart({ items }: { items: Array<{ label: string; value: number }> }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No yearly trend available yet.</p>;
  }

  const width = 560;
  const height = 220;
  const padding = 20;
  const maxValue = getMaxValue(items);
  const stepX = items.length > 1 ? (width - padding * 2) / (items.length - 1) : 0;

  const points = items.map((item, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((item.value / maxValue) * (height - padding * 2));
    return { x, y, item };
  });

  const linePath =
    points.length > 0
      ? points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
      : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`
      : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
        <CalendarRange className="h-4 w-4 text-cyan-100" />
        Claims by incident year
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
        <defs>
          <linearGradient id="yearly-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.08)" />
          </linearGradient>
        </defs>
        {points.length > 0 ? <path d={areaPath} fill="url(#yearly-fill)" opacity="0.7" /> : null}
        {points.map((point, index) => (
          <g key={point.item.label}>
            {index > 0 ? (
              <line
                x1={points[index - 1].x}
                y1={points[index - 1].y}
                x2={point.x}
                y2={point.y}
                stroke="rgba(103,232,249,0.95)"
                strokeWidth="2"
              />
            ) : null}
            <circle cx={point.x} cy={point.y} r="4" fill="rgba(253,230,138,0.95)" />
            <text x={point.x} y={height - 4} fill="rgba(226,232,240,0.7)" fontSize="11" textAnchor="middle">
              {point.item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="bg-white/6">
      <CardHeader className="pb-3">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-2xl font-semibold text-white">{value}</p>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function PortfolioAnalyticsPanel({
  portfolio,
  analytics,
}: {
  portfolio: PortfolioSelect;
  analytics: PortfolioAnalytics | null;
}) {
  if (!analytics) {
    return (
      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45">
        <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
        <CardHeader>
          <CardTitle className="text-base">{portfolio.name}</CardTitle>
          <CardDescription>No claim data matched this portfolio yet.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          Import more data or loosen the filters to see charts and totals here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={BadgeDollarSign}
          title="Total claims amount"
          value={formatCurrency(analytics.totalClaimAmount)}
          description="Sum of all matching claim values"
        />
        <MetricCard
          icon={ChartColumn}
          title="Matching claims"
          value={String(analytics.totalClaims)}
          description="Rows included by the portfolio filters"
        />
        <MetricCard
          icon={ArrowUpRight}
          title="Average claim"
          value={formatCurrency(analytics.averageClaimAmount)}
          description="Average claim amount in the portfolio"
        />
        <MetricCard
          icon={Users}
          title="Gender split"
          value={analytics.genderBreakdown.map((item) => `${item.label}: ${item.value}`).join(" / ") || "N/A"}
          description="Policyholder gender distribution"
        />
      </div>

      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45">
        <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
        <CardHeader>
          <CardTitle className="text-base">{portfolio.name}</CardTitle>
          <CardDescription>
            Filtered analytics for the currently selected portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AreaChart items={analytics.yearlyTotals} />

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <MapPinned className="h-4 w-4 text-cyan-100" />
                Top incident states
              </div>
              <BarSeries items={analytics.stateBreakdown} emptyLabel="No state data yet." />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <Users className="h-4 w-4 text-cyan-100" />
                Gender breakdown
              </div>
              <BarSeries items={analytics.genderBreakdown} emptyLabel="No gender data yet." />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <ChartColumn className="h-4 w-4 text-cyan-100" />
                Top makes
              </div>
              <BarSeries items={analytics.makeBreakdown} emptyLabel="No make data yet." />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <CalendarRange className="h-4 w-4 text-cyan-100" />
              Recent matching claims
            </div>
            <div className="space-y-2">
              {analytics.recentClaims.map((claim) => (
                <div
                  key={`${String(claim.incidentDate)}-${claim.autoMake}-${claim.incidentCity}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200"
                >
                  <span>
                    {claim.autoMake} in {claim.incidentCity}
                  </span>
                  <span>{formatCurrency(toNumber(claim.totalClaimAmount as string | number))}</span>
                  <span className="text-slate-400">{String(claim.incidentDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
