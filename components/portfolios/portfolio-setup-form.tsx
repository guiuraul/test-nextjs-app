"use client";

import { useActionState } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

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

const selectClassName =
  "h-11 w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/35 px-4 pr-9 text-sm text-white outline-none transition-colors focus:border-cyan-300/35 focus:ring-0";

function SelectField({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={selectClassName}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

type PortfolioSetupFormProps = {
  incidentYears: number[];
};

export function PortfolioSetupForm({ incidentYears }: PortfolioSetupFormProps) {
  const [state, action, pending] = useActionState(
    createPortfolioAction,
    initialPortfolioActionState
  );

  return (
    <form action={action} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="text-slate-100">
              Portfolio name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="BMW Ohio 2020"
              required
              className="h-11 rounded-2xl border-white/10 bg-slate-950/35 px-4 text-white placeholder:text-slate-500 focus:border-cyan-300/35"
            />
            <FieldNote>Give it a short name you can recognize right away in the dashboard.</FieldNote>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyState" className="text-slate-100">
              Policy state
            </Label>
            <SelectField
              id="policyState"
              name="policyState"
              defaultValue=""
            >
              {usStateOptions.map((option) => (
                <option key={option.value || "any-policy-state"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuredSex" className="text-slate-100">
              Policyholder gender
            </Label>
            <SelectField
              id="insuredSex"
              name="insuredSex"
              defaultValue=""
            >
              {insuredGenderOptions.map((option) => (
                <option key={option.value || "any-gender"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidentState" className="text-slate-100">
              Incident state
            </Label>
            <SelectField
              id="incidentState"
              name="incidentState"
              defaultValue=""
            >
              {usStateOptions.map((option) => (
                <option key={option.value || "any-incident-state"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoMake" className="text-slate-100">
              Car brand
            </Label>
            <SelectField id="autoMake" name="autoMake" defaultValue="">
              <option value="">Any brand</option>
              {carMakeOptions.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidentYear" className="text-slate-100">
              Incident year
            </Label>
            <SelectField id="incidentYear" name="incidentYear" defaultValue="">
              <option value="">Any year</option>
              {incidentYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTotalClaimAmount" className="text-slate-100">
              Claim amount under
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">
                $
              </span>
              <Input
                id="maxTotalClaimAmount"
                name="maxTotalClaimAmount"
                type="text"
                inputMode="numeric"
                placeholder="5,000"
                className="h-11 rounded-2xl border-white/10 bg-slate-950/35 pl-7 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-300/35"
              />
            </div>
            <FieldNote>Leave blank if there is no limit.</FieldNote>
          </div>
        </div>
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

      <Button type="submit" disabled={pending} className="h-11 w-full rounded-full">
        {pending ? "Saving..." : "Save portfolio"}
      </Button>
    </form>
  );
}
