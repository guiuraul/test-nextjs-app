import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AppPageShell } from "@/components/app-page-shell";
import { ImportClaimsForm } from "@/components/imports/import-claims-form";
import { SignedInPill } from "@/components/auth/signed-in-pill";
import { SignOutForm } from "@/components/auth/sign-out-form";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function ImportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <AppPageShell
      eyebrow="Imports"
      title="Bring in the claims file in one calm step."
      description="Upload the reference file, let the app check the structure first, and keep the import process clear for the insurance agent."
      panelLabel="Import flow"
      panelTitle="Keep the upload safe"
      panelDescription="The file is checked before anything is stored, so a bad upload is stopped with a clear message."
      heroTags={["Exact template", "Header validation", "Safe upload"]}
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
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-4">
          <p className="text-sm font-medium text-white">Need a template?</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Download the reference CSV and fill it with the same columns the insurance agent will use.
          </p>
          <Link
            href="/templates/insurance_claims_template.csv"
            className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-300/20"
          >
            Download template
          </Link>
        </div>

        <ImportClaimsForm />
      </div>
    </AppPageShell>
  );
}

