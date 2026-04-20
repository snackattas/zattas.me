"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

export function PillGrid({ children }: { children?: ReactNode }) {
  return (
    <div className="not-prose mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export function Pill({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  const className =
    "inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300/80 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-700/80";

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="truncate">{children}</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">↗</span>
      </Link>
    );
  }

  return (
    <div className={className}>
      <span className="truncate">{children}</span>
    </div>
  );
}

export function DetailPill({
  title,
  href,
  children,
}: {
  title: ReactNode;
  href?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const descriptionId = useId();

  useEffect(() => {
    if (href) return;
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const baseClassName =
    "inline-flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300/80 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-700/80";

  return (
    <div
      ref={rootRef}
      className="group relative"
      data-open={open ? "true" : "false"}
    >
      {href ? (
        <Link
          href={href}
          className={baseClassName}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby={descriptionId}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span className="truncate">{title}</span>
          <span className="text-xs text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
            ↗
          </span>
        </Link>
      ) : (
        <button
          type="button"
          className={baseClassName}
          aria-expanded={open}
          aria-describedby={descriptionId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span className="truncate">{title}</span>
          <span className="text-xs text-zinc-500 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
            ▾
          </span>
        </button>
      )}

      <div
        id={descriptionId}
        className={
          "pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 origin-top rounded-xl border border-zinc-200/70 bg-white p-4 text-zinc-700 shadow-lg opacity-0 ring-1 ring-black/5 transition dark:border-zinc-800/70 dark:bg-zinc-950 dark:text-zinc-200 dark:ring-white/10 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 data-[open=true]:pointer-events-auto data-[open=true]:opacity-100"
        }
      >
        <div className="prose prose-zinc max-w-none text-base leading-7 dark:prose-invert">
          {children}
        </div>
      </div>
    </div>
  );
}
