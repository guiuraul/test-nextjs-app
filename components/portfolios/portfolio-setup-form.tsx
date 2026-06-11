"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import {
  createPortfolioAction,
} from "@/app/actions/portfolios";
import { initialPortfolioActionState } from "@/app/actions/portfolios-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  carMakeOptions,
  insuredGenderOptions,
  usStateOptions,
} from "@/lib/portfolio/filter-options";

function FieldNote({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-300">{children}</p>;
}

export function PortfolioSetupForm() {
  const [state, action, pending] = useActionState(
    createPortfolioAction,
    initialPortfolioActionState
  );

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Portfolio name</Label>
          <Input id="name" name="name" placeholder="BMW Ohio 2020" required />
          <FieldNote>Give it a short name you can recognize in the dashboard menu.</FieldNote>
        </div>

        <div className="space-y-2">
          <Label htmlFor="policyState">Policy state</Label>
          <select
            id="policyState"
            name="policyState"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue=""
          >
            {usStateOptions.map((option) => (
              <option key={option.value || "any-policy-state"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuredSex">Policyholder gender</Label>
          <select
            id="insuredSex"
            name="insuredSex"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue=""
          >
            {insuredGenderOptions.map((option) => (
              <option key={option.value || "any-gender"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentState">Incident state</Label>
          <select
            id="incidentState"
            name="incidentState"
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue=""
          >
            {usStateOptions.map((option) => (
              <option key={option.value || "any-incident-state"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="autoMake">Car brand</Label>
          <Input id="autoMake" name="autoMake" list="car-makes" placeholder="BMW" />
          <datalist id="car-makes">
            {carMakeOptions.map((make) => (
              <option key={make} value={make} />
            ))}
          </datalist>
          <FieldNote>Start typing to search known brands from the insurance dataset.</FieldNote>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentYear">Incident year</Label>
          <Input id="incidentYear" name="incidentYear" type="number" placeholder="2020" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTotalClaimAmount">Max total claim amount</Label>
          <Input
            id="maxTotalClaimAmount"
            name="maxTotalClaimAmount"
            type="number"
            placeholder="5000"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">How this portfolio will be saved</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          The selected filters are stored in the database as a portfolio record, so the dashboard
          can load and analyze the same definition later.
        </p>
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

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save portfolio"}
      </Button>
    </form>
  );
}
