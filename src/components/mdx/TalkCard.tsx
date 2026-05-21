"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type TalkKind = "Conference Talk" | "Podcast" | "Meetup" | "Panel";

export function TalkGrid({ children }: { children: ReactNode }) {
  return <div className="talk-grid">{children}</div>;
}

export function TalkCard({
  title,
  conference,
  href,
  date,
  kind = "Conference Talk",
  imageSrc,
  imageAlt,
  logoMode,
  children,
}: {
  title: string;
  conference: string;
  href?: string;
  date: string;
  kind?: TalkKind;
  imageSrc: string;
  imageAlt?: string;
  logoMode?: boolean;
  children?: ReactNode;
}) {
  const contain = logoMode ?? imageSrc.endsWith(".svg");

  return (
    <div
      className="talk-card tilt-card reveal"
      style={{
        border: "2px solid var(--border)",
        margin: "-1px 0 0 -1px",
        background: "var(--bg)",
        overflow: "hidden",
        transition: "all 0.12s",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderBottom: "2px solid var(--border)",
          background: contain ? "var(--bg)" : "var(--surface)",
          overflow: "hidden",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt ?? conference}
          fill
          sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw"
          style={{
            objectFit: contain ? "contain" : "cover",
            padding: contain ? "18px" : 0,
          }}
        />
      </div>

      <div
        style={{
          padding: "18px 20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {kind}
        </div>
        <div
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.66rem",
            color: "var(--muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {date} · {conference}
        </div>
        <h3
          style={{
            margin: "4px 0 0",
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>
        {children ? (
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--muted)",
              lineHeight: 1.5,
              marginTop: "4px",
            }}
          >
            {children}
          </div>
        ) : null}
        {href ? (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "auto",
              paddingTop: "14px",
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--fg)",
              textDecoration: "none",
              alignSelf: "flex-end",
            }}
          >
            {kind === "Podcast" ? "LISTEN ↗" : "VIEW ↗"}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
