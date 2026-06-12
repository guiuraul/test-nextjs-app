"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

type BrandBadgeProps = {
  href?: string;
  children?: ReactNode;
};

function BrandMark({ children }: { children?: ReactNode }) {
  return (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 text-cyan-50 shadow-lg shadow-cyan-400/10">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.24em] text-cyan-100 uppercase">
          Risk Atlas
        </p>
        <p className="text-xs text-slate-300">
          {children ?? "Private insurance portfolio tracking"}
        </p>
      </div>
    </>
  );
}

export function BrandBadge({ href, children }: BrandBadgeProps) {
  if (href) {
    return (
      <Link href={href} className="group flex items-center gap-3">
        <BrandMark>{children}</BrandMark>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <BrandMark>{children}</BrandMark>
    </div>
  );
}
