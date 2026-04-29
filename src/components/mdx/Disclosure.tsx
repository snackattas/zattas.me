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
      style={{
        border: "2px solid var(--border)",
        background: "var(--surface)",
        padding: "16px",
        transition: "all 0.12s",
      }}
      open={defaultOpen}
    >
      <summary
        style={{
          display: "flex",
          cursor: "pointer",
          listStyle: "none",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg)", fontFamily: "var(--font-space-mono)" }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "var(--muted)" }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            marginTop: "4px",
            color: "var(--muted)",
            transition: "transform 0.2s",
          }}
        >
          <span aria-hidden>▾</span>
        </div>
      </summary>

      <div style={{ marginTop: "12px", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--fg)" }}>
        {children}
      </div>
    </details>
  );
}
