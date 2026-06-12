import { BrandBadge } from "@/components/brand-badge";
import { SiteFooter } from "@/components/site-footer";

function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-2xl bg-white/5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandBadge href="/" />

          <div className="flex items-center gap-2">
            <LoadingCard className="h-11 w-28 rounded-full border border-emerald-300/20 bg-emerald-300/10" />
            <LoadingCard className="h-11 w-32 rounded-full border border-white/10 bg-white/5" />
            <LoadingCard className="h-11 w-24 rounded-full border border-white/10 bg-white/5" />
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:items-start">
          <section className="space-y-5 pt-4">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
                Loading workspace
              </p>
              <div className="space-y-3">
                <LoadingCard className="h-12 w-[min(100%,38rem)] rounded-2xl" />
                <LoadingCard className="h-12 w-[min(100%,32rem)] rounded-2xl" />
              </div>
              <LoadingCard className="h-6 w-[min(100%,34rem)] rounded-full" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <LoadingCard className="h-28 rounded-[1.25rem] border border-white/10 bg-slate-950/45" />
              <LoadingCard className="h-28 rounded-[1.25rem] border border-white/10 bg-slate-950/45" />
              <LoadingCard className="h-28 rounded-[1.25rem] border border-white/10 bg-slate-950/45" />
              <LoadingCard className="h-28 rounded-[1.25rem] border border-white/10 bg-slate-950/45" />
            </div>
          </section>

          <section className="pt-2 lg:pt-0 lg:self-end">
            <LoadingCard className="h-[22rem] rounded-[2rem] border border-white/10 bg-slate-950/45" />
          </section>
        </main>

        <SiteFooter>Built for private insurance portfolio analysis.</SiteFooter>
      </div>
    </div>
  );
}
