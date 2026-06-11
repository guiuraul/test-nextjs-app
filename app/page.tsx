import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/server";

const highlights = [
  {
    title: "Private by default",
    description: "Each user sees only their own portfolios, imports, and analysis.",
    icon: LockKeyhole,
  },
  {
    title: "Age-gated signup",
    description: "Registration stops immediately if the birth date is under 18 years.",
    icon: ShieldCheck,
  },
  {
    title: "Built for growth",
    description: "The first slice is auth, but the structure is ready for CSV imports and charts.",
    icon: UploadCloud,
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col justify-between gap-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 text-cyan-50 shadow-lg shadow-cyan-400/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-cyan-100 uppercase">
                Portfolio Studio
              </p>
              <p className="text-xs text-slate-300">Insurance portfolio management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-5 text-sm font-medium transition hover:bg-cyan-300/20"
                style={{ color: "#ffffff" }}
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 text-sm font-medium transition hover:bg-white/12"
                  style={{ color: "#ffffff" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-5 text-sm font-medium transition hover:bg-cyan-300/20"
                  style={{ color: "#ffffff" }}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-medium text-amber-50">
              <Sparkles className="h-3.5 w-3.5" />
              A clean starting point for the challenge
            </span>

            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Manage private insurance portfolios with a polished dashboard ready for analysis.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                This first slice gives you secure signup and login with Supabase, plus a manual
                age check that blocks users younger than 18 before account creation.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-5 py-3 text-sm font-medium transition hover:bg-cyan-300/20"
                style={{ color: "#ffffff" }}
              >
                <span className="inline-flex items-center gap-2">
                  Start with signup
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-medium transition hover:bg-white/12"
                style={{ color: "#ffffff" }}
              >
                <span className="inline-flex items-center gap-2">
                  I already have an account
                </span>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="bg-white/6">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
                        <Icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="lg:pl-6">
            <Card className="relative overflow-hidden border-cyan-300/15 bg-slate-950/35">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_30%)]" />
              <CardHeader className="relative">
                <CardTitle>What you get first</CardTitle>
                <CardDescription>
                  A working auth foundation we can extend into imports, portfolio rules, and charts.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-100">1. Secure signup</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Full name, email, password, and birth date are validated on the server.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-100">2. Age gate</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    The app blocks registration if the user is younger than 18.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-100">3. Private dashboard</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Signed-in users are redirected to a protected dashboard page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="pb-2 text-sm text-slate-400">
          Built with Next.js, Supabase, Tailwind CSS, and shadcn-style UI primitives.
        </footer>
      </div>
    </div>
  );
}
