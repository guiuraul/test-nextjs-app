"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signUpAction } from "@/app/actions/auth";
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

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialAuthState);

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Sign up with your email, then confirm that you are 18 or older.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" placeholder="Alex Pop" required />
            <FieldError errors={state.fieldErrors?.fullName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth date</Label>
            <Input id="birthDate" name="birthDate" type="date" required />
            <FieldError errors={state.fieldErrors?.birthDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="alex@example.com" required />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Minimum 8 characters" required />
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
            {pending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-cyan-100 hover:text-white">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
