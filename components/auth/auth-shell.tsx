import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col justify-between gap-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 text-cyan-50 shadow-lg shadow-cyan-400/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                Portfolio Studio
              </p>
              <p className="text-xs text-slate-300">Insurance analytics workspace</p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            style={{ color: "#ffffff" }}
          >
            Back home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <main className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-medium text-amber-50">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </span>

            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="bg-white/6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Age check</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>
                    We block registration unless the user is at least 18.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Supabase auth</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>
                    Cookie-based sessions keep the app deployable on Vercel.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Ready to expand</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>
                    This foundation will later power CSV imports and portfolio dashboards.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>{children}</section>
        </main>

        <footer className="pb-2 text-sm text-slate-400">{footer}</footer>
      </div>
    </div>
  );
}
