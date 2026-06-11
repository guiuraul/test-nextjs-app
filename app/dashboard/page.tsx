import { redirect } from "next/navigation";
import { BarChart3, DatabaseZap, LockKeyhole } from "lucide-react";

import { SignOutForm } from "@/components/auth/sign-out-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/server";

const metrics = [
  {
    title: "Private account",
    value: "1 user = 1 workspace",
    icon: LockKeyhole,
  },
  {
    title: "Ready for imports",
    value: "CSV ingestion comes next",
    icon: DatabaseZap,
  },
  {
    title: "Dashboard shell",
    value: "Charts and filters will plug in here",
    icon: BarChart3,
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-cyan-100 uppercase">
              Authenticated space
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Welcome, {user.email ?? "user"}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              The first vertical slice is live: secure sign up, login, and age validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 md:block">
              Next: CSV import and portfolio rules
            </div>
            <SignOutForm />
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card key={metric.title} className="bg-white/6">
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{metric.value}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section>
            <Card className="overflow-hidden border-emerald-300/15 bg-slate-950/45">
              <div className="h-2 bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
              <CardHeader>
                <CardTitle>Step 1 completed</CardTitle>
                <CardDescription>
                  We now have a protected entry point that can be deployed on Vercel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-50">What works now</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Signup and login are wired to Supabase, and the registration flow checks that
                    the user is at least 18 before the account is created.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-50">What comes next</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    We can now move to the database schema, CSV import flow, and portfolio builder.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-slate-50">Testing note</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Set your Supabase environment variables, create a project, then test the
                    sign-up form with a birth date older than 18 years.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
