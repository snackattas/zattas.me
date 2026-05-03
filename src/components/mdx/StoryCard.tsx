"use client";

import { type ReactNode, useState } from "react";

export function StoryCard({
  num,
  title,
  hook,
  children,
}: {
  num?: string;
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
      className="story-card tilt-card"
      style={{
        border: "2px solid var(--border)",
        margin: "-1px 0 0 -1px",
        padding: "24px 22px",
        background: "var(--bg)",
        transition: "all 0.12s",
        cursor: "default",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        style={{
          width: "100%",
          padding: 0,
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        aria-expanded={shouldShow}
      >
        {num && (
          <div
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.68rem",
              color: "var(--accent)",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            {num}
          </div>
        )}
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--fg)", fontFamily: "var(--font-syne)", lineHeight: 1.2 }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: "0.72rem", fontStyle: "italic", color: "var(--muted)", fontFamily: "var(--font-space-mono)", lineHeight: 1.5 }}>
          &ldquo;{hook}&rdquo;
        </p>
      </button>

      <div
        style={{
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          maxHeight: shouldShow ? "1000px" : "0",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <div style={{ marginTop: "16px", fontSize: "0.82rem", lineHeight: 1.7, color: "var(--muted)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
