import type { ReactNode } from "react";
import Image from "next/image";

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="mt-6 space-y-10">{children}</div>;
}

function formatDate(
  date: Date,
  monthDisplay: boolean,
  yearDisplay: boolean
): string {
  if (yearDisplay) {
    // yearDisplay: "2022" style
    return date.toLocaleDateString("en-US", { year: "numeric" });
  }
  if (monthDisplay) {
    // monthDisplay: "Jan '22" style
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.toLocaleDateString("en-US", { year: "2-digit" });
    return `${month} '${year}`;
  }
  // Fallback to year if neither is set
  return date.toLocaleDateString("en-US", { year: "numeric" });
}

function formatDateRange(
  startDate: string,
  endDate?: string,
  isCurrent: boolean = false,
  createdDate: string = "",
  monthDisplay: boolean = true,
  yearDisplay: boolean = false,
  showCreated: boolean = true
): string | null {

  if (createdDate) {
    const date = new Date(createdDate);
    const formattedDate = formatDate(date, monthDisplay, yearDisplay);
    return showCreated ? `Created ${formattedDate}` : formattedDate;
  }

  const start = new Date(startDate);
  const startFormatted = formatDate(start, monthDisplay, yearDisplay);

  if (isCurrent) {
    return `${startFormatted} - Present`;
  }

  if (endDate) {
    const end = new Date(endDate);
    const endFormatted = formatDate(end, monthDisplay, yearDisplay);
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

export function TimelineItem({
  title,
  subtitle,
  startDate,
  endDate,
  isCurrent = false,
  createdDate = "",
  monthDisplay = true,
  yearDisplay = false,
  showCreated = true,
  imageSrc,
  imageAlt,
  children,
}: {
  title: ReactNode;
  subtitle?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  createdDate?: string;
  monthDisplay?: boolean;
  yearDisplay?: boolean;
  showCreated?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  const dateRange = formatDateRange(startDate, endDate, isCurrent, createdDate, monthDisplay, yearDisplay, showCreated);

  return (
    <div className="group relative">
      <div className="transition-transform duration-150 will-change-transform motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.03] motion-safe:hover:drop-shadow-lg">
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="m-0 text-lg font-semibold leading-7">{title}</h3>
            {dateRange ? (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{dateRange}</span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="m-0 text-sm text-zinc-600 dark:text-zinc-300">{subtitle}</p>
          ) : null}
          {children ? (
            <div className="prose prose-zinc dark:prose-invert [&_li]:rounded-md [&_li]:px-2 [&_li]:py-1 [&_li]:transition-colors [&_li:hover]:bg-zinc-200/70 dark:[&_li:hover]:bg-white/15">
              {children}
            </div>
          ) : null}
        </div>
      </div>

      {imageSrc ? (
        <div className="pointer-events-none fixed right-6 top-24 z-50 hidden w-96 opacity-0 transition-opacity duration-150 group-hover:opacity-100 xl:block">
          <div className="overflow-hidden rounded-xl border border-zinc-200/70 bg-white/70 shadow-lg backdrop-blur dark:border-zinc-800/70 dark:bg-black/40">
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              width={960}
              height={540}
              className="h-auto w-full"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
