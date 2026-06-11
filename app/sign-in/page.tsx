import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Private access"
      title="Sign in to your insurance analytics dashboard."
      description="Only authenticated users can access the next steps of the product, keeping each portfolio isolated."
      footer="If Supabase email confirmations are enabled, verify your email first before signing in."
    >
      <SignInForm />
    </AuthShell>
  );
}
