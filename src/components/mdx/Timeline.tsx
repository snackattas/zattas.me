"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="timeline" style={{ marginTop: "24px" }}>{children}</div>;
}

function parseDateString(dateStr: string): Date {
  const parts = dateStr.split("-");
  const year = parseInt(parts[0] || "0", 10);
  const month = parseInt(parts[1] || "1", 10);
  const day = parseInt(parts[2] || "1", 10);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date, monthDisplay: boolean, yearDisplay: boolean): string {
  if (yearDisplay) return date.toLocaleDateString("en-US", { year: "numeric" });
  if (monthDisplay) {
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.toLocaleDateString("en-US", { year: "2-digit" });
    return `${month} '${year}`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric" });
}

function formatDateRange(
  startDate: string,
  endDate?: string,
  isCurrent: boolean = false,
  createdDate: string = "",
  monthDisplay: boolean = true,
  yearDisplay: boolean = false,
  showCreated: boolean = true,
): string | null {
  if (createdDate) {
    const date = parseDateString(createdDate);
    const formattedDate = formatDate(date, monthDisplay, yearDisplay);
    return showCreated ? `Created ${formattedDate}` : formattedDate;
  }
  const start = parseDateString(startDate);
  const startFormatted = formatDate(start, monthDisplay, yearDisplay);
  if (isCurrent) return `${startFormatted} — Present`;
  if (endDate) {
    const end = parseDateString(endDate);
    const endFormatted = formatDate(end, monthDisplay, yearDisplay);
    return `${startFormatted} — ${endFormatted}`;
  }
  return startFormatted;
}

export function TimelineItemGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: "20px", marginBottom: "4px" }}>
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export type Stat = { v: ReactNode; k: string };

function StatGrid({ stats }: { stats: Stat[] }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div
      className="tl-stats"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        border: "2px solid var(--border)",
        marginBottom: "20px",
      }}
    >
      <style>{`
        @media (max-width: 700px) {
          .tl-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .tl-stat { padding: 18px 16px; border-right: 2px solid var(--border); }
        .tl-stat:last-child { border-right: none; }
        @media (max-width: 700px) {
          .tl-stat { border-right: none !important; border-bottom: 2px solid var(--border); }
          .tl-stat:nth-child(odd) { border-right: 2px solid var(--border) !important; }
          .tl-stat:nth-last-child(-n+2):nth-child(even) { border-bottom: none; }
          .tl-stat:last-child { border-bottom: none; }
        }
        .tl-stat .v {
          font-family: var(--font-syne);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.6vw, 2rem);
          line-height: 1;
          color: var(--accent);
          letter-spacing: -0.03em;
        }
        .tl-stat .k {
          font-family: var(--font-space-mono);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 8px;
          line-height: 1.4;
        }
      `}</style>
      {stats.map((s, i) => (
        <div className="tl-stat" key={i}>
          <div className="v">{s.v}</div>
          <div className="k">{s.k}</div>
        </div>
      ))}
    </div>
  );
}

function TimelineItemContent({
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
  logoMode,
  hook,
  stats,
  defaultOpen,
  num,
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
  logoMode?: boolean;
  hook?: string;
  stats?: Stat[];
  defaultOpen?: boolean;
  num?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen ?? isCurrent);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR hydration guard
  useEffect(() => { setMounted(true); }, []);

  const dateRange = formatDateRange(startDate, endDate, isCurrent, createdDate, monthDisplay, yearDisplay, showCreated);
  const contain = logoMode ?? (imageSrc?.endsWith(".svg") ?? false);

  return (
    <div
      className={`tl-row ${open ? "open" : ""}`}
      style={{
        border: "2px solid var(--border)",
        margin: "-2px 0 0",
        background: open ? "var(--surface)" : "var(--bg)",
        transition: "background 0.18s",
      }}
    >
      <style>{`
        .tl-row .tl-head {
          display: grid;
          grid-template-columns: 56px 64px 1fr auto 28px;
          gap: 0 18px;
          align-items: center;
          padding: 18px 22px;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          color: inherit;
          font: inherit;
        }
        @media (max-width: 760px) {
          .tl-row .tl-head {
            grid-template-columns: 56px 1fr 28px;
            row-gap: 8px;
          }
          .tl-row .tl-num-cell { grid-column: 2; grid-row: 1; }
          .tl-row .tl-titlewrap { grid-column: 2; grid-row: 2; }
          .tl-row .tl-date-cell { grid-column: 1 / 4; grid-row: 3; }
          .tl-row .tl-chev-cell { grid-column: 3; grid-row: 1; }
        }
        .tl-logo {
          width: 56px;
          height: 56px;
          border: 2px solid var(--border);
          background: var(--bg);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .tl-num-cell {
          font-family: var(--font-space-mono);
          font-size: 0.7rem;
          color: var(--accent);
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .tl-co {
          font-family: var(--font-syne);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .tl-co a { color: var(--fg) !important; text-decoration: none !important; transition: color 0.12s; }
        .tl-co a:hover { color: var(--accent) !important; }
        .tl-role {
          font-family: var(--font-space-mono);
          font-size: 0.7rem;
          color: var(--muted);
          letter-spacing: 0.04em;
          margin-top: 3px;
        }
        .tl-hook {
          font-family: var(--font-space-mono);
          font-style: italic;
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 8px;
          line-height: 1.5;
        }
        .tl-date-cell {
          font-family: var(--font-space-mono);
          font-size: 0.72rem;
          color: var(--muted);
          white-space: nowrap;
          text-align: right;
        }
        .tl-chev-cell {
          font-family: var(--font-space-mono);
          font-size: 1.1rem;
          color: var(--accent);
          text-align: center;
          font-weight: 700;
        }
        .tl-body {
          padding: 4px 22px 28px;
          overflow: hidden;
          transition: opacity 0.25s;
        }
        .tl-body p { margin: 0 0 0.85em; }
        @media (max-width: 899px) {
          .tl-preview { display: none !important; }
        }
      `}</style>

      <button
        type="button"
        className="tl-head"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        aria-expanded={open}
      >
        <div className="tl-logo">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              width={56}
              height={56}
              style={{
                width: "100%",
                height: "100%",
                objectFit: contain ? "contain" : "cover",
                padding: contain ? "6px" : 0,
              }}
            />
          ) : null}
        </div>
        <div className="tl-num-cell">{num}</div>
        <div className="tl-titlewrap">
          <div className="tl-co">{title}</div>
          {subtitle ? <div className="tl-role">{subtitle}</div> : null}
          {hook ? <div className="tl-hook">&ldquo;{hook}&rdquo;</div> : null}
        </div>
        <div className="tl-date-cell">{dateRange}</div>
        <div className="tl-chev-cell">{open ? "–" : "+"}</div>
      </button>

      {open ? (
        <div className="tl-body">
          {stats && stats.length > 0 ? <StatGrid stats={stats} /> : null}
          {children}
        </div>
      ) : null}

      {imageSrc && mounted && !open
        ? createPortal(
            <div
              className="tl-preview"
              style={{
                display: showPreview ? "block" : "none",
                position: "fixed",
                right: "max(20px, 5vw)",
                top: "80px",
                width: "280px",
                zIndex: 200,
                pointerEvents: "none",
                border: "2px solid var(--border)",
                boxShadow: "6px 6px 0 var(--fg)",
                background: "var(--bg)",
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt ?? ""}
                width={280}
                height={180}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export const TimelineItem = TimelineItemContent;
