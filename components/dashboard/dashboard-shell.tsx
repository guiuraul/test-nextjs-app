"use client";

import Link from "next/link";
import { BadgeDollarSign, ChartColumn, Files, Layers3 } from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";

import { BrandBadge } from "@/components/brand-badge";
import { SignedInPill } from "@/components/auth/signed-in-pill";
import { PortfolioAnalyticsPanel } from "@/components/dashboard/portfolio-analytics";
import { PortfolioSelector, type PortfolioSummary } from "@/components/dashboard/portfolio-selector";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioAnalytics } from "@/lib/portfolio/analytics";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function SummaryCard({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45 shadow-xl shadow-black/15">
      <CardHeader className="pb-2">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle className="text-base text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-2xl font-semibold leading-tight text-white">{value}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardShell({
  portfolios,
  analyticsByPortfolioId,
  initialSelectedPortfolioId,
  signedInEmail,
}: {
  portfolios: PortfolioSummary[];
  analyticsByPortfolioId: Record<string, PortfolioAnalytics | null>;
  initialSelectedPortfolioId: string;
  signedInEmail?: string | null;
}) {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(initialSelectedPortfolioId);
  const selectedPortfolio =
    portfolios.find((portfolio) => portfolio.id === selectedPortfolioId) ?? portfolios[0] ?? null;
  const analytics =
    selectedPortfolio ? analyticsByPortfolioId[selectedPortfolio.id] ?? null : null;

  const overviewCards = [
    {
      icon: Layers3,
      title: "Saved groups",
      value: String(portfolios.length),
    },
    {
      icon: Files,
      title: "Active group",
      value: selectedPortfolio?.name ?? "None",
    },
    {
      icon: ChartColumn,
      title: "Claims in view",
      value: analytics ? String(analytics.totalClaims) : "0",
    },
    {
      icon: BadgeDollarSign,
      title: "Total claim value",
      value: analytics ? formatCurrency(analytics.totalClaimAmount) : "$0",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandBadge href="/dashboard" />

          <div className="flex flex-wrap items-center gap-3">
            <SignedInPill email={signedInEmail} />
            <Link
              href="/portfolio-setup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/25 px-5 text-sm font-medium text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/30"
              style={{ color: "#fff" }}
            >
              New portfolio
            </Link>
            <Link
              href="/imports"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/20 px-4 text-sm font-medium text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/25"
              style={{ color: "#fff" }}
            >
              Import CSV
            </Link>
            <SignOutForm />
          </div>
        </header>

        <main className="space-y-6 pb-2">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-start">
            <div className="space-y-5 pt-4">
              <div className="max-w-3xl space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Keep your saved claim groups in one clear view.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Choose a group, review the claim totals, and see the breakdowns an insurance
                  agent actually needs.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => (
                  <SummaryCard
                    key={card.title}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 lg:pt-0 lg:self-end">
              <PortfolioSelector
                portfolios={portfolios}
                selectedPortfolioId={selectedPortfolio?.id ?? ""}
                onSelectPortfolioId={setSelectedPortfolioId}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {selectedPortfolio ? selectedPortfolio.name : "No group selected"}
              </h2>
            </div>

            {selectedPortfolio ? (
              <PortfolioAnalyticsPanel
                portfolio={{ name: selectedPortfolio.name }}
                analytics={analytics}
              />
            ) : (
              <Card className="overflow-hidden border-dashed border-white/10 bg-slate-950/45">
                <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
                <CardHeader>
                  <CardTitle className="text-base text-white">No group selected</CardTitle>
                  <CardDescription className="text-slate-300">
                    Create and save a group first, then choose it from the selector to see the
                    numbers here.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </section>
        </main>

        <SiteFooter>Built for private insurance portfolio analysis.</SiteFooter>
      </div>
    </div>
  );
}
