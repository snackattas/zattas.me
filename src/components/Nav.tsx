import Link from "next/link";

import type { NavSection } from "@/lib/sections";

export function Nav({
  sections,
  variant = "sticky",
  overlayMode = "expanded",
}: {
  sections: NavSection[];
  variant?: "sticky" | "overlay";
  overlayMode?: "expanded" | "collapsed";
}) {
  const isOverlay = variant === "overlay";
  const isOverlayCollapsed = isOverlay && overlayMode === "collapsed";

  return (
    <nav
      className={
        isOverlay
          ? "bg-transparent"
          : "sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-black/60"
      }
    >
      <div
        className={
          isOverlay
            ? isOverlayCollapsed
              ? "mx-auto flex w-full max-w-6xl flex-wrap items-start gap-x-6 gap-y-0 px-6 py-1 text-base"
              : "mx-auto flex w-full max-w-6xl items-start gap-x-10 px-6 pt-8 text-base"
            : "mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-sm"
        }
      >
        <div
          className={
            isOverlay
              ? isOverlayCollapsed
                ? "mr-3 shrink-0 self-center text-2xl font-medium leading-none tracking-tight text-white sm:basis-auto"
                : "mr-5 shrink-0 text-3xl font-medium leading-none tracking-tight text-white md:text-5xl"
              : "mr-2 font-semibold tracking-tight"
          }
        >
          Zach Attas
        </div>
        {isOverlay && !isOverlayCollapsed ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-6 gap-y-2 lg:flex-nowrap lg:justify-between">
            {sections.map((s) => (
              <Link
                key={s.anchor}
                href={`#${s.anchor}`}
                className="group relative basis-1/3 px-2 pb-2 pt-2 text-white transition-colors duration-150 hover:text-white/75 focus-visible:text-white/75 focus-visible:outline-none lg:basis-auto lg:flex-1"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 rounded-2xl bg-white/18 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 lg:-top-8"
                />
                <div className="relative z-10 flex flex-col items-start">
                  <span className="tabular-nums text-xs font-semibold leading-none text-white/90 group-hover:text-white/70 group-focus-visible:text-white/70">
                    {s.indexLabel}
                  </span>
                  <span className="whitespace-nowrap leading-none">
                    {s.navLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          isOverlayCollapsed ? (
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-x-4 gap-y-1 lg:grid-cols-6">
              {sections.map((s) => (
                <Link
                  key={s.anchor}
                  href={`#${s.anchor}`}
                  className="inline-flex min-w-0 whitespace-nowrap rounded-md px-2 py-1 text-sm text-white transition-[background-color,color] duration-150 hover:bg-white/18 hover:text-white/75 focus-visible:bg-white/18 focus-visible:text-white/75 focus-visible:outline-none"
                >
                  <span className="tabular-nums font-semibold text-white/90">{s.indexLabel}</span>{" "}
                  <span className="min-w-0 truncate">{s.navLabel}</span>
                </Link>
              ))}
            </div>
          ) : (
            sections.map((s) => (
              <Link
                key={s.anchor}
                href={`#${s.anchor}`}
                className={
                  isOverlay
                    ? "inline-flex whitespace-nowrap rounded-md px-3 py-2 text-white/95 transition-[background-color,color] duration-150 hover:bg-black/35 hover:text-white focus-visible:bg-black/35 focus-visible:text-white focus-visible:outline-none"
                    : "text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                }
              >
                <span
                  className={
                    isOverlay
                      ? "tabular-nums font-semibold text-white/80"
                      : "tabular-nums font-semibold text-zinc-400 dark:text-zinc-500"
                  }
                >
                  {s.indexLabel}
                </span>{" "}
                {s.navLabel}
              </Link>
            ))
          )
        )}
      </div>
    </nav>
  );
}
