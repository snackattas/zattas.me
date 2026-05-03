"use client";

import Image from "next/image";

const SOCIAL_LINKS = [
  { href: "mailto:zach.attas@gmail.com", label: "Email", icon: "/icons/mail.svg" },
  { href: "https://github.com/snackattas", label: "GitHub", icon: "/icons/github.svg" },
  { href: "https://www.linkedin.com/in/zachary-attas-79b9a153", label: "LinkedIn", icon: "/icons/linkedin.svg" },
  { href: "https://www.google.com/maps/place/Chicago,+IL", label: "Chicago on Google Maps", icon: "/icons/map-pin.svg" },
  { href: "https://medium.com/@zach.attas", label: "Medium", icon: "/icons/medium.svg" },
];

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "60vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* 1. Video layer — behind everything */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/coding-screenshot.jpg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/videos/header.webm" type="video/webm" />
        <source src="/videos/header.mp4" type="video/mp4" />
      </video>

      {/* 2. Flat dark overlay — NOT a gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 9, 8, 0.58)",
          zIndex: 1,
        }}
      />

      {/* 3. Content — sits above video + overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(32px, 5vh, 60px) var(--gutter) clamp(32px, 5vh, 60px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Role line */}
        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "16px",
          }}
        >
          Staff Platform Engineer &nbsp;·&nbsp; Chicago, IL &nbsp;·&nbsp; Self-taught
        </p>

        {/* Giant name — outlined + solid */}
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          {/* "ZACH" — outlined white */}
          <span
            style={{
              display: "block",
              color: "transparent",
              WebkitTextStroke: "2px #ffffff",
            }}
          >
            ZACH
          </span>
          {/* "ATTAS" — solid warm white, offset right */}
          <span
            style={{
              display: "block",
              color: "#faf8f4",
              paddingLeft: "clamp(20px, 4vw, 80px)",
            }}
          >
            ATTAS
          </span>
        </h1>

        {/* Orange accent divider */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "var(--accent)",
            margin: "28px 0 20px",
          }}
        />

        {/* Tagline + social icons */}
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
              color: "rgba(255,255,255,0.72)",
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

          {/* Social icon links */}
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
                  border: "2px solid rgba(255,255,255,0.4)",
                  background: "transparent",
                  textDecoration: "none",
                  transition: "background 0.12s, border-color 0.12s",
                }}
              >
                <Image
                  src={icon}
                  alt=""
                  width={16}
                  height={16}
                  style={{ filter: "invert(1) brightness(10)" }}
                />
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
            color: "rgba(255,255,255,0.4)",
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
              background: "rgba(255,255,255,0.4)",
            }}
          />
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
