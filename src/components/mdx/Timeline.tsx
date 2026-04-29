import type { ReactNode } from "react";
import Image from "next/image";

export function Timeline({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "40px" }}>{children}</div>;
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
    <div className="reveal" style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px 12px" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.75, fontFamily: "var(--font-syne)" }}>{title}</h3>
          {dateRange ? (
            <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}>{dateRange}</span>
          ) : null}
        </div>
        {subtitle ? (
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--fg)" }}>{subtitle}</p>
        ) : null}
        {children ? (
          <div style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--fg)" }}>
            {children}
          </div>
        ) : null}
      </div>

      {imageSrc ? (
        <div style={{
          pointerEvents: "none",
          position: "fixed",
          right: "24px",
          top: "96px",
          zIndex: 50,
          width: "384px",
          opacity: 0,
          transition: "opacity 0.15s",
          display: "none",
        }}>
          <div style={{ overflow: "hidden", border: "2px solid var(--border)", background: "var(--surface)", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}>
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              width={960}
              height={540}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
