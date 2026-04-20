import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function ProjectCard({
  title,
  href,
  meta,
  imageSrc,
  imageAlt,
  children,
}: {
  title: string;
  href?: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:border-zinc-300/80 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950 dark:hover:border-zinc-700/80">
      {imageSrc ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
          <div className="relative h-40 w-full">
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className="m-0 text-base font-semibold leading-6">
          {href ? (
            <Link
              href={href}
              className="text-zinc-950 no-underline underline-offset-4 hover:underline focus-visible:underline dark:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {meta ? (
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {meta}
          </span>
        ) : null}
      </div>
      {children ? (
        <div className="mt-3 max-w-none text-sm leading-6 text-zinc-700 dark:text-zinc-200 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-zinc-400/70 hover:[&_a]:decoration-zinc-800 dark:[&_a]:decoration-zinc-500/70 dark:hover:[&_a]:decoration-zinc-100">
          {children}
        </div>
      ) : null}
    </div>
  );
}
