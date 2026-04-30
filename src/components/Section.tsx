import type { ReactNode } from "react";

export function Section({
  anchor,
  indexLabel,
  children,
}: {
  anchor: string;
  indexLabel: string;
  children: ReactNode;
}) {
  return (
    <section
      id={anchor}
      style={{
        padding: "clamp(60px, 10vh, 120px) var(--gutter) 0",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Ghost number watermark — sits behind the MDX h1 */}
      <div
        className="section-num"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "60px",
          left: "clamp(0px, -20px, 40px)",
          fontFamily: "var(--font-space-mono)",
          fontWeight: 700,
          fontSize: "clamp(5rem, 14vw, 10rem)",
          lineHeight: 1,
          color: "var(--accent)",
          opacity: 0.12,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        {indexLabel}
      </div>

      {/* MDX content — the h1 inside MDX gets z-index:1 */}
      <div className="reveal" style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}
