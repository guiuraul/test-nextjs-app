import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AppPageShell } from "@/components/app-page-shell";
import { SignedInPill } from "@/components/auth/signed-in-pill";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { PortfolioList } from "@/components/portfolios/portfolio-list";
import { PortfolioSetupForm } from "@/components/portfolios/portfolio-setup-form";
import { getUserIncidentYears, getUserPortfolios } from "@/lib/portfolio/queries";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function PortfolioSetupPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const portfolios = await getUserPortfolios(user.id);
  const incidentYears = await getUserIncidentYears(user.id);

  return (
    <AppPageShell
      eyebrow="Portfolio setup"
      title="Save a portfolio you can open again in seconds."
      description="Choose the filters that matter, give the group a clear name, and keep it ready for the dashboard whenever you need it."
      panelLabel="Portfolio setup"
      panelTitle="Build a clear group"
      panelDescription="Use filters that an insurance agent can understand at a glance."
      heroTags={["Private to your account", "Simple filters", "Ready for the dashboard"]}
      headerRight={
        <>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-300/20 px-5 text-sm font-medium text-white shadow-sm shadow-cyan-500/10 transition hover:bg-cyan-300/25"
            style={{ color: "#fff" }}
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <SignedInPill email={user.email ?? null} />
          <SignOutForm />
        </>
      }
      footer="Built for private insurance portfolio analysis."
      leftBelow={
        <section className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
            Saved portfolios
          </p>
          <PortfolioList portfolios={portfolios} />
        </section>
      }
    >
      <PortfolioSetupForm incidentYears={incidentYears} />
    </AppPageShell>
  );
}
