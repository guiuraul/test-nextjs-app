"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SignedInPillProps = {
  email?: string | null;
  className?: string;
  children?: ReactNode;
};

export function SignedInPill({ email, className, children }: SignedInPillProps) {
  const label = children ?? "Signed in";
  const accountLabel = email?.trim();

  return (
    <div
      className={cn(
        "inline-flex max-w-[16rem] items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-left shadow-sm shadow-emerald-500/10",
        className
      )}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300/30" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
      </span>

      <span className="min-w-0 leading-tight">
        <span className="block text-[10px] font-semibold tracking-[0.24em] text-emerald-50/90 uppercase">
          {label}
        </span>
        {accountLabel ? (
          <span className="block max-w-[12rem] truncate text-xs text-emerald-50/75">
            {accountLabel}
          </span>
        ) : null}
      </span>
    </div>
  );
}
