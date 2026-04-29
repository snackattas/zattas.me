"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

export function PillGrid({ children }: { children?: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px", marginTop: "16px" }}>
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
  const styles = {
    display: "inline-flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    border: "2px solid var(--border)",
    background: "var(--bg)",
    padding: "8px 12px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--fg)",
    fontFamily: "var(--font-space-mono)",
    textDecoration: "none",
    transition: "all 0.12s",
    textTransform: "uppercase",
    cursor: "pointer",
  } as const;

  if (href) {
    return (
      <Link
        href={href}
        style={styles}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg)";
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
        <span style={{ fontSize: "0.75rem", color: "var(--fg)" }}>↗</span>
      </Link>
    );
  }

  return (
    <div style={styles}>
      <span>{children}</span>
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
  }, [open]);

  const baseStyle = {
    display: "inline-flex",
    width: "100%" as const,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    border: "2px solid var(--border)",
    background: "var(--bg)",
    padding: "8px 12px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--fg)",
    fontFamily: "var(--font-space-mono)",
    textDecoration: "none",
    transition: "all 0.12s",
    textTransform: "uppercase" as const,
    cursor: "pointer" as const,
  };

  return (
    <div
      ref={rootRef}
      style={{ position: "relative", display: "inline-block" }}
      data-open={open ? "true" : "false"}
    >
      {href ? (
        <Link
          href={href}
          style={baseStyle}
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
          <span>{title}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--fg)" }}>↗</span>
        </Link>
      ) : (
        <button
          type="button"
          style={baseStyle}
          aria-expanded={open}
          aria-describedby={descriptionId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span>{title}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--fg)" }}>▾</span>
        </button>
      )}

      <div
        id={descriptionId}
        style={{
          pointerEvents: open ? "auto" : "none",
          position: "absolute",
          left: "50%",
          top: "100%",
          zIndex: 10,
          marginTop: "8px",
          width: "min(36rem, calc(100vw - 2rem))",
          transform: "translateX(-50%)",
          border: "2px solid var(--border)",
          background: "var(--surface)",
          padding: "16px",
          fontSize: "0.875rem",
          color: "var(--fg)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.12s",
        }}
      >
        <div style={{ lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
