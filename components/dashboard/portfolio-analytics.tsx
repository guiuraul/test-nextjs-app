"use client";

import type { ComponentType } from "react";
import {
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  CalendarRange,
  ChartColumn,
  PieChart,
  MapPinned,
  Users,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioAnalytics } from "@/lib/portfolio/analytics";

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

function getTopItem(items: Array<{ label: string; value: number }>) {
  return items[0] ?? null;
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
    return <p className="text-sm text-slate-300">{emptyLabel}</p>;
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

function AreaChart({
  items,
  title,
  icon: Icon,
  emptyLabel,
}: {
  items: Array<{ label: string; value: number }>;
  title: string;
  icon: ComponentType<{ className?: string }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Icon className="h-4 w-4 text-cyan-100" />
          {title}
        </div>
        <p className="text-sm text-slate-300">{emptyLabel}</p>
      </div>
    );
  }

  const width = 560;
  const height = 260;
  const padding = 24;
  const leftAxisWidth = 76;
  const topPadding = 18;
  const bottomPadding = 36;
  const chartWidth = width - leftAxisWidth - padding;
  const chartHeight = height - topPadding - bottomPadding;
  const maxValue = getMaxValue(items);
  const stepX = items.length > 1 ? chartWidth / (items.length - 1) : 0;
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const value = maxValue * (1 - ratio);
    const y = topPadding + chartHeight * ratio;

    return {
      value,
      y,
    };
  });

  const points = items.map((item, index) => {
    const x = leftAxisWidth + index * stepX;
    const y = topPadding + chartHeight - (item.value / maxValue) * chartHeight;
    return { x, y, item };
  });

  const linePath =
    points.length > 0
      ? points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
      : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L ${leftAxisWidth + chartWidth} ${topPadding + chartHeight} L ${leftAxisWidth} ${topPadding + chartHeight} Z`
      : "";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 shadow-xl shadow-black/10">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Icon className="h-4 w-4 text-cyan-100" />
        {title}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-[240px] w-full">
        <defs>
          <linearGradient id={`chart-fill-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.08)" />
          </linearGradient>
        </defs>
        {yTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={leftAxisWidth}
              y1={tick.y}
              x2={width - padding}
              y2={tick.y}
              stroke="rgba(148,163,184,0.12)"
              strokeDasharray="6 8"
            />
            <text
              x={leftAxisWidth - 8}
              y={tick.y + 4}
              fill="rgba(226,232,240,0.65)"
              fontSize="11"
              textAnchor="end"
            >
              {formatCurrency(tick.value)}
            </text>
          </g>
        ))}
        {points.length > 0 ? <path d={areaPath} fill={`url(#chart-fill-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()})`} opacity="0.7" /> : null}
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
            <circle cx={point.x} cy={point.y} r="5" fill="rgba(253,230,138,0.95)" />
            <circle cx={point.x} cy={point.y} r="10" fill="rgba(253,230,138,0.08)" />
            <text x={point.x} y={height - 10} fill="rgba(226,232,240,0.7)" fontSize="11" textAnchor="middle">
              {point.item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ClaimMixChart({
  items,
  title,
  icon: Icon,
  emptyLabel,
}: {
  items: Array<{ label: string; value: number }>;
  title: string;
  icon: ComponentType<{ className?: string }>;
  emptyLabel: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total <= 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 shadow-xl shadow-black/10">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Icon className="h-4 w-4 text-cyan-100" />
          {title}
        </div>
        <p className="text-sm text-slate-300">{emptyLabel}</p>
      </div>
    );
  }

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const colors = ["#67e8f9", "#34d399", "#fbbf24"];
  const segments = items.reduce<
    Array<{
      item: { label: string; value: number };
      dash: number;
      offset: number;
      color: string;
    }>
  >((acc, item, index) => {
    const dash = (item.value / total) * circumference;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;

    acc.push({
      item,
      dash,
      offset,
      color: colors[index % colors.length],
    });

    return acc;
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 shadow-xl shadow-black/10">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Icon className="h-4 w-4 text-cyan-100" />
        {title}
      </div>
      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)] md:items-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-[180px] w-[180px]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {segments.map(({ item, dash, offset, color }) => {
            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
          <text
            x="50%"
            y="52%"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
          >
            CLAIM VALUE
          </text>
        </svg>

        <div className="space-y-3">
          {items.map((item, index) => {
            const color = colors[index % colors.length];
            const share = `${Math.round((item.value / total) * 100)}%`;

            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-white">{share}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatCurrency(item.value)}</span>
                  <span>{Math.round((item.value / total) * 100)}% of value</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
      <CardHeader className="pb-2">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle className="text-base text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-2xl font-semibold text-white">{value}</p>
        <CardDescription className="mt-1 text-slate-300">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function PortfolioAnalyticsPanel({
  portfolio,
  analytics,
}: {
  portfolio: { name: string };
  analytics: PortfolioAnalytics | null;
}) {
  const topState = getTopItem(analytics?.stateBreakdown ?? []);
  const claimMix = [
    { label: "Injury", value: analytics?.totalInjuryClaim ?? 0 },
    { label: "Property", value: analytics?.totalPropertyClaim ?? 0 },
    { label: "Vehicle", value: analytics?.totalVehicleClaim ?? 0 },
  ];

  if (!analytics) {
    return (
      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45">
        <CardHeader>
          <CardTitle className="text-base text-white">{portfolio.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">No claim data matched this group yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={BadgeDollarSign}
          title="Total claim value"
          value={formatCurrency(analytics.totalClaimAmount)}
          description="The total value of claims in this group"
        />
        <MetricCard
          icon={ChartColumn}
          title="Claims in this group"
          value={String(analytics.totalClaims)}
          description="How many claim rows match the current group"
        />
        <MetricCard
          icon={ArrowUpRight}
          title="Average claim value"
          value={formatCurrency(analytics.averageClaimAmount)}
          description="The average amount for one claim in this group"
        />
        <MetricCard
          icon={MapPinned}
          title="Top state"
          value={topState ? topState.label : "N/A"}
          description={
            topState ? `${topState.value} claims in the strongest state` : "No state data yet"
          }
        />
      </div>

      <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45">
        <CardHeader>
          <CardTitle className="text-base text-white">{portfolio.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-2">
            <AreaChart
              items={analytics.monthlyTotals}
              title="Claim trend by month"
              icon={CalendarRange}
              emptyLabel="No monthly trend yet."
            />
            <AreaChart
              items={analytics.yearlyTotals}
              title="Claim trend by year"
              icon={CalendarDays}
              emptyLabel="No yearly trend yet."
            />
          </div>

          <ClaimMixChart
            items={claimMix}
            title="Claim value mix"
            icon={PieChart}
            emptyLabel="No claim mix data yet."
          />

          <div className="grid gap-3 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <MapPinned className="h-4 w-4 text-cyan-100" />
                States
              </div>
              <BarSeries items={analytics.stateBreakdown} emptyLabel="No state data yet." />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <Users className="h-4 w-4 text-cyan-100" />
                Gender
              </div>
              <BarSeries items={analytics.genderBreakdown} emptyLabel="No gender data yet." />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <ChartColumn className="h-4 w-4 text-cyan-100" />
                Makes
              </div>
              <BarSeries items={analytics.makeBreakdown} emptyLabel="No make data yet." />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <CalendarRange className="h-4 w-4 text-cyan-100" />
              Recent claims in this group
            </div>
            <div className="space-y-2">
              {analytics.recentClaims.map((claim) => (
                <div
                  key={`${String(claim.incidentDate)}-${claim.autoMake}-${claim.incidentCity}`}
                  className="grid gap-2 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3 text-center text-sm text-slate-200 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center"
                >
                  <span className="text-slate-200 md:text-left">
                    {claim.autoMake} in {claim.incidentCity}
                  </span>
                  <span className="text-center text-base font-semibold text-white">
                    {formatCurrency(toNumber(claim.totalClaimAmount as string | number))}
                  </span>
                  <span className="text-slate-400 md:text-right">{String(claim.incidentDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
