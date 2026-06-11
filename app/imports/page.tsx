import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/server";
import { ImportClaimsForm } from "@/components/imports/import-claims-form";

export default async function ImportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Card className="border-white/10 bg-white/6">
          <CardHeader>
            <CardTitle>Import insurance claims</CardTitle>
            <CardDescription>
              Upload the exact `insurance_claims.csv` format used by the reviewer. We validate
              the headers before importing so the app stays safe even if the file is incorrect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">What this page expects</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  <li>The headers must match the sample CSV schema.</li>
                  <li>`_c39` is derived automatically from make and model.</li>
                  <li>Incorrect files are rejected with clear messages.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-4">
                <p className="text-sm font-medium text-white">Need a template?</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Download the reference CSV template and fill it with your own data.
                </p>
                <Link
                  href="/templates/insurance_claims_template.csv"
                  className="mt-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-300/20"
                >
                  Download template
                </Link>
              </div>
            </div>
            <ImportClaimsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

