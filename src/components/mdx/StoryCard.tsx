"use client";

import { type ReactNode, useState } from "react";

export function StoryCard({
  title,
  hook,
  children,
}: {
  title: string;
  hook: string;
  children: ReactNode;
}) {
  const [clickedState, setClickedState] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const shouldShow = clickedState !== null ? clickedState : isHovered;

  const handleClick = () => {
    setClickedState(!shouldShow);
  };

  return (
    <div
      className="reveal tilt-card"
      style={{
        border: "2px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden",
        transition: "all 0.12s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          padding: "20px",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background 0.12s",
        }}
        aria-expanded={shouldShow}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(0, 0, 0, 0.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.75, fontFamily: "var(--font-syne)" }}>
              {title}
            </h3>
            <p style={{ marginTop: "12px", marginBottom: 0, fontSize: "0.875rem", fontStyle: "italic", color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}>
              &ldquo;{hook}&rdquo;
            </p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: "4px" }}>
            <span
              style={{
                display: "inline-block",
                color: "var(--muted)",
                transition: "transform 0.2s",
                transform: shouldShow ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </div>
        </div>
      </button>

      <div
        style={{
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          maxHeight: shouldShow ? "1000px" : "0",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <div style={{ borderTop: "2px solid var(--border)", padding: "16px 20px 20px", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--fg)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
