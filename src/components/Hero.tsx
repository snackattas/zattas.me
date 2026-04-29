"use client";

import Image from "next/image";

const SOCIAL_LINKS = [
  { href: "mailto:zach.attas@gmail.com", label: "Email", icon: "/icons/mail.svg" },
  { href: "https://github.com/snackattas", label: "GitHub", icon: "/icons/github.svg" },
  { href: "https://www.linkedin.com/in/zachary-attas-79b9a153", label: "LinkedIn", icon: "/icons/linkedin.svg" },
  { href: "https://medium.com/@zach.attas", label: "Medium", icon: "/icons/medium.svg" },
];

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "calc(100svh - 52px)",
        padding: "clamp(40px, 8vh, 100px) var(--gutter) 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Role line */}
      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "16px",
        }}
      >
        Staff Platform Engineer &nbsp;·&nbsp; Chicago, IL &nbsp;·&nbsp; Self-taught
      </p>

      {/* Giant name */}
      <h1
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "clamp(4.5rem, 14vw, 12rem)",
          lineHeight: 0.88,
          letterSpacing: "-0.04em",
          color: "var(--fg)",
          userSelect: "none",
        }}
      >
        {/* Outlined first word */}
        <span
          style={{
            display: "block",
            color: "transparent",
            WebkitTextStroke: "2px var(--fg)",
          }}
        >
          ZACH
        </span>
        {/* Solid second word, offset right */}
        <span
          style={{
            display: "block",
            paddingLeft: "clamp(20px, 4vw, 80px)",
          }}
        >
          ATTAS
        </span>
      </h1>

      {/* Orange divider */}
      <div
        style={{
          width: "100%",
          height: "2px",
          background: "var(--accent)",
          margin: "28px 0 20px",
        }}
      />

      {/* Tagline + social links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px 32px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
            color: "var(--muted)",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Building core infrastructure, internal tooling, and sustainable test
          systems at{" "}
          <a
            href="https://www.capsule.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Capsule
          </a>
          . Started in QA, taught myself to code — moved from writing tests to
          building the platforms that power them.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: "inline-flex",
                width: "36px",
                height: "36px",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--border)",
                background: "transparent",
                textDecoration: "none",
                transition: "background 0.12s, border-color 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              <Image src={icon} alt="" width={16} height={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "var(--gutter)",
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "var(--muted)",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            display: "block",
            width: "40px",
            height: "1px",
            background: "var(--muted)",
          }}
        />
        Scroll to explore
      </div>
    </section>
  );
}
