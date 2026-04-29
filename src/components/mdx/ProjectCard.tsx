"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function ProjectCard({
  title,
  href,
  meta,
  imageSrc,
  imageAlt,
  children,
}: {
  title: string;
  href?: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="reveal tilt-card"
      style={{
        border: "2px solid var(--border)",
        background: "var(--surface)",
        padding: "20px",
        transition: "all 0.12s",
      }}
    >
      {imageSrc ? (
        <div
          style={{
            marginBottom: "16px",
            overflow: "hidden",
            border: "2px solid var(--border)",
          }}
        >
          <div style={{ position: "relative", height: "160px", width: "100%" }}>
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px 16px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.5, fontFamily: "var(--font-syne)" }}>
          {href ? (
            <Link
              href={href}
              style={{ color: "var(--fg)", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--fg)";
              }}
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {meta ? (
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}>
            {meta}
          </span>
        ) : null}
      </div>
      {children ? (
        <div style={{ marginTop: "12px", fontSize: "0.875rem", lineHeight: 1.6, color: "var(--fg)" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
