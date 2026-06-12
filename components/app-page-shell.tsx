"use client";

import type { ReactNode } from "react";

import { BrandBadge } from "@/components/brand-badge";
import { SiteFooter } from "@/components/site-footer";

type ShellItem = {
  title: string;
  text: string;
};

type AppPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  panelLabel: string;
  panelTitle: string;
  panelDescription: string;
  panelItems?: ShellItem[];
  heroTags?: string[];
  headerRight: ReactNode;
  children: ReactNode;
  leftBelow?: ReactNode;
  below?: ReactNode;
  footer: ReactNode;
};

export function AppPageShell({
  eyebrow,
  title,
  description,
  panelLabel,
  panelTitle,
  panelDescription,
  panelItems = [],
  heroTags = [],
  headerRight,
  children,
  leftBelow,
  below,
  footer,
}: AppPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandBadge href="/dashboard" />

          <div className="flex flex-wrap items-center gap-2">{headerRight}</div>
        </header>

        <main className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-start">
          <section className="space-y-8 pt-6 lg:pt-10">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
                {eyebrow}
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[0.96] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                {description}
              </p>
            </div>

            {heroTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs font-medium tracking-wide text-slate-300/80">
                {heroTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {leftBelow ? <div className="pt-4 lg:pt-6">{leftBelow}</div> : null}
          </section>

          <section className="pt-2 lg:justify-self-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_36%)]" />
              <div className="relative space-y-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
                    {panelLabel}
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">{panelTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{panelDescription}</p>
                </div>

                {panelItems.length > 0 ? (
                  <div className="space-y-3">
                    {panelItems.map((item, index) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3"
                      >
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-300/15 text-[11px] font-semibold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="pt-1">{children}</div>
              </div>
            </div>
          </section>
        </main>

        {below ? <div className="space-y-6">{below}</div> : null}

        <SiteFooter>{footer}</SiteFooter>
      </div>
    </div>
  );
}
