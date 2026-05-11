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
        className="nav-container"
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
                {s.anchor === "automation-fun"
                  ? <span className="nav-disco">{s.navLabel}</span>
                  : s.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes navDisco {
          0%   { color: #e8500a; }
          16%  { color: #d4a017; }
          33%  { color: #2e9e4f; }
          50%  { color: #2176ae; }
          66%  { color: #7b3fa0; }
          83%  { color: #c0334d; }
          100% { color: #e8500a; }
        }
        .nav-disco {
          animation: navDisco 3s linear infinite;
        }
        @media (max-width: 767px) {
          .nav-container {
            height: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: var(--gutter) !important;
          }

          nav a {
            padding: 6px 8px !important;
            font-size: 0.65rem !important;
            gap: 4px !important;
            border: none !important;
          }

          nav a:hover {
            border: none !important;
            background-color: rgba(255,255,255,0.05) !important;
          }
        }
      `}</style>
    </nav>
  );
}
