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
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {/* Top row: Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "52px",
            paddingRight: "0",
          }}
        >
          <Link
            href="#hero"
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "0.95rem",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              color: "var(--fg)",
              flexShrink: 0,
            }}
          >
            ZACH ATTAS
          </Link>
        </div>

        {/* Bottom row: Nav links - flows horizontally, wraps on mobile */}
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0",
            listStyle: "none",
            padding: "0",
            margin: "0",
          }}
        >
          {sections.map((s) => (
            <li
              key={s.anchor}
              style={{}}
            >
              <Link
                href={`#${s.anchor}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 8px",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.65rem",
                  color: "var(--muted)",
                  textDecoration: "none",
                  border: "none",
                  transition: "color 0.12s, background-color 0.12s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--fg)";
                  el.style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = "var(--muted)";
                  el.style.backgroundColor = "transparent";
                }}
              >
                <span
                  style={{
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {s.indexLabel}
                </span>
                <span>{s.navLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (min-width: 768px) {
          nav > div {
            flex-direction: row;
            align-items: center;
            gap: 0;
          }

          nav > div > div:first-child {
            height: 52px;
            display: flex;
            align-items: center;
            margin-right: auto;
          }

          nav ul {
            border-top: none !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            gap: 2px !important;
            margin-left: 0;
          }

          nav li {
            border: none !important;
          }

          nav a {
            flex-direction: row !important;
            gap: 5px !important;
            align-items: center !important;
            padding: 4px 10px !important;
            border: 1px solid transparent !important;
            background-color: transparent !important;
            font-size: 0.72rem !important;
          }

          nav a:hover {
            border-color: var(--border) !important;
            color: var(--fg) !important;
          }
        }
      `}</style>
    </nav>
  );
}
