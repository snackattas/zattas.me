import type { ReactNode } from "react";

export function Disclosure({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className="group rounded-2xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition hover:border-zinc-300/80 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950 dark:hover:border-zinc-700/80"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        <div className="mt-0.5 text-zinc-500 transition group-open:rotate-180 dark:text-zinc-400">
          <span aria-hidden>▾</span>
        </div>
      </summary>

      <div className="prose prose-zinc mt-3 max-w-none text-sm leading-6 dark:prose-invert">
        {children}
      </div>
    </details>
  );
}
