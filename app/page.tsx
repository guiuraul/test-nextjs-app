import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandBadge } from "@/components/brand-badge";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { SignedInPill } from "@/components/auth/signed-in-pill";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandBadge />

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/20 px-4 text-sm font-medium text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/25"
                  style={{ color: "#fff" }}
                >
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <SignedInPill email={user.email ?? null} />
                <SignOutForm className="px-4 text-sm" />
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/25 px-5 text-sm font-medium text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/30"
                  style={{ color: "#fff" }}
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                    href="/sign-in"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/8 bg-slate-900/55 px-5 text-sm font-medium text-white/90 transition hover:bg-slate-800/70 hover:text-white"
                    style={{ color: "#fff" }}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-center">
          <section className="space-y-8 pt-6 lg:pt-10">
            <div className="max-w-3xl space-y-5">
              <h1 className="max-w-2xl text-4xl font-semibold leading-[0.96] tracking-tight text-white sm:text-5xl lg:text-6xl">
                See your insurance claims in one clean place
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Upload your data, save the groups you care about, and compare totals, trends, and
                distributions without the clutter
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium tracking-wide text-slate-300/80">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Private to your account
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Easy to review
              </span>
            </div>
          </section>

          <section className="pt-2 lg:justify-self-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_36%)]" />
              <div className="relative space-y-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
                    How it works
                  </p>
                  <p className="mt-2 text-lg font-medium text-white">
                    A simple flow for everyone
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "Upload your file",
                      text: "Start with the provided format and bring your claims in safely",
                    },
                    {
                      title: "Choose a portfolio",
                      text: "Group the cases you want to compare by the criteria that matter to you",
                    },
                    {
                      title: "Review the results",
                      text: "Switch between portfolios and see totals and charts update right away",
                    },
                  ].map((item, index) => (
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
              </div>
            </div>
          </section>
        </main>

        <SiteFooter>Built for private insurance portfolio analysis.</SiteFooter>
      </div>
    </div>
  );
}
