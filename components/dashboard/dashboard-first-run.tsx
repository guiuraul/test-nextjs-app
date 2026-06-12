"use client";

import Link from "next/link";
import { ArrowRight, FileUp, LockKeyhole } from "lucide-react";

import { BrandBadge } from "@/components/brand-badge";
import { SignedInPill } from "@/components/auth/signed-in-pill";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardFirstRunProps = {
  signedInEmail?: string | null;
  canGoToPortfolioSetup?: boolean;
};

export function DashboardFirstRun({
  signedInEmail,
  canGoToPortfolioSetup = false,
}: DashboardFirstRunProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandBadge href="/dashboard" />

          <div className="flex flex-wrap items-center gap-3">
            <SignedInPill email={signedInEmail} />
            <SignOutForm />
          </div>
        </header>

        <main className="flex flex-1 items-center">
          <section className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="max-w-2xl space-y-6">
              <p className="text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
                First step
              </p>
              <h1 className="max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Upload the claims CSV to unlock your dashboard.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Your dashboard is waiting, but it cannot show totals, charts, or saved groups
                until the insurance claims file is imported first.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                    <FileUp className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-white">Import the CSV</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Bring in the claims file to make the dashboard usable.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-white">Create portfolios</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Saved groups only make sense once the data is in place.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-white">Review results</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Charts, totals, and breakdowns appear right after import.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/imports"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-300/25 px-6 text-sm font-medium !text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/30 hover:!text-white visited:!text-white"
                >
                  Upload CSV to continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                {canGoToPortfolioSetup ? (
                  <Link
                    href="/portfolio-setup"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-medium !text-white transition hover:bg-white/10 hover:!text-white visited:!text-white"
                  >
                    Go to portfolio setup
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title="Upload a CSV first to unlock portfolio setup."
                    className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-medium !text-white/50 opacity-60"
                  >
                    Go to portfolio setup
                  </span>
                )}
              </div>
            </div>

            <Card className="overflow-hidden border-cyan-300/15 bg-slate-950/45 shadow-xl shadow-black/15">
              <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
              <CardHeader>
                <CardTitle className="text-base text-white">Dashboard locked</CardTitle>
                <CardDescription className="text-slate-300">
                  Import the claims file first so the analytics can render real values.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">Nothing to show yet</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The dashboard will stay here until a CSV is uploaded and processed. Once that
                    happens, your portfolios and charts will unlock automatically.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
                      Required
                    </p>
                    <p className="mt-2 text-base font-medium text-white">Claims CSV import</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      This is the first step before any analysis can appear.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
                      Next
                    </p>
                    <p className="mt-2 text-base font-medium text-white">Saved portfolios</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Build groups after the data is in the workspace.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <SiteFooter>Built for private insurance portfolio analysis.</SiteFooter>
      </div>
    </div>
  );
}
