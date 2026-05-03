"use client";

import Link from "next/link";
import type { NavSection } from "@/lib/sections";

export function Nav({ sections }: { sections: NavSection[] }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg)",
        borderBottom: "2px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 var(--gutter)",
          height: "52px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Site name */}
        <Link
          href="#hero"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "0.95rem",
            letterSpacing: "-0.02em",
            textDecoration: "none",
            color: "var(--fg)",
            marginRight: "24px",
            flexShrink: 0,
          }}
        >
          ZACH ATTAS
        </Link>

        {/* Nav links */}
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2px",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {sections.map((s) => (
            <li key={s.anchor}>
              <Link
                href={`#${s.anchor}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.72rem",
                  color: "var(--muted)",
                  textDecoration: "none",
                  border: "1px solid transparent",
                  transition: "color 0.12s, border-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--fg)";
                  el.style.borderColor = "var(--border)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--muted)";
                  el.style.borderColor = "transparent";
                }}
              >
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.indexLabel}
                </span>{" "}
                {s.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
