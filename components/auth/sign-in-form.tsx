"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [state, formAction, pending] = useActionState(signInAction, initialAuthState);

  return (
    <Card className="w-full border-white/10 bg-slate-950/40 text-white shadow-none">
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-100">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alex@example.com"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-100">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
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

          <Button
            type="submit"
            className="w-full bg-sky-400/25 text-white shadow-sm shadow-sky-500/15 hover:bg-sky-400/30"
            disabled={pending}
          >
            {pending ? "Opening dashboard..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          New here?{" "}
          <Link href="/sign-up" className="group inline-flex font-medium text-cyan-100 hover:text-white">
            <span className="inline-flex flex-col items-center">
              <span>Create an account</span>
              <span className="mt-0.5 h-px w-full rounded-full bg-sky-300/70 transition-opacity group-hover:bg-sky-200/90" />
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
