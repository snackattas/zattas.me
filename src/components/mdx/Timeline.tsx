"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function Timeline({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: "24px" }}>{children}</div>;
}

function formatDate(
  date: Date,
  monthDisplay: boolean,
  yearDisplay: boolean
): string {
  if (yearDisplay) {
    return date.toLocaleDateString("en-US", { year: "numeric" });
  }
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

export function TimelineItemGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: "16px", marginBottom: "4px" }}>
      <div
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent)",
        }}
      >
        {title}
      </div>
      {children}
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
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const dateRange = formatDateRange(startDate, endDate, isCurrent, createdDate, monthDisplay, yearDisplay, showCreated);

  return (
    <div
      className="tl-item"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      style={{
        padding: "24px 0",
        borderTop: "2px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "12px",
      }}
    >
      <style>{`
        @media (min-width: 900px) {
          .tl-item {
            grid-template-columns: 180px 1fr !important;
            gap: 0 40px !important;
          }
          .tl-left { grid-column: 1; }
          .tl-body { grid-column: 2; }
        }
      `}</style>

      <div className="tl-left" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          className="tl-date"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
            letterSpacing: "0.04em",
          }}
        >
          {dateRange}
        </div>
        <div
          className="tl-company"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          <style>{`
            .tl-company a {
              color: var(--fg) !important;
              text-decoration: none !important;
              transition: color 0.12s;
            }
            .tl-company a:hover {
              color: var(--accent) !important;
            }
          `}</style>
          {title}
        </div>
        {subtitle ? (
          <div
            className="tl-role"
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.72rem",
              color: "var(--muted)",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {children ? (
        <div
          className="tl-body"
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.7,
            color: "var(--muted)",
          }}
        >
          {children}
        </div>
      ) : null}

      {imageSrc && mounted
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
            document.body
          )
        : null}
    </div>
  );
}

export const TimelineItem = TimelineItemContent;
