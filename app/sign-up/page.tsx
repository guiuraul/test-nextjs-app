import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Manual 18+ validation"
      title="Create a private account for your portfolio workspace."
      description="This first step gives you a secure account flow and enforces the minimum age rule before Supabase creates the user."
      footer="After signup, the same account will be used for private CSV imports, portfolios, and dashboards."
    >
      <SignUpForm />
    </AuthShell>
  );
}
