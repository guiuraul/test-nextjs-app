"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialAuthState } from "@/lib/auth/validation";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-200">{errors[0]}</p>;
}

export function SignInForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signInAction, initialAuthState);

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/dashboard");
    }
  }, [router, state.status]);

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue to your private insurance analytics workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="alex@example.com" required />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Your password" required />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          {state.message ? (
            <div
              className={[
                "rounded-2xl border px-4 py-3 text-sm",
                state.status === "success"
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-50"
                  : "border-rose-300/20 bg-rose-300/10 text-rose-50",
              ].join(" ")}
            >
              {state.message}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          New here?{" "}
          <Link href="/sign-up" className="font-medium text-cyan-100 hover:text-white">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
