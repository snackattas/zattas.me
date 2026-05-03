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
  featured = false,
}: {
  title: string;
  href?: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: ReactNode;
  featured?: boolean;
}) {
  const imageHeight = featured ? 200 : 160;
  const cardStyle = featured ? { gridColumn: "1 / -1" } : {};

  return (
    <div
      className="project-card tilt-card reveal"
      style={{
        border: "2px solid var(--border)",
        margin: "-1px 0 0 -1px",
        background: "var(--bg)",
        overflow: "hidden",
        transition: "all 0.12s",
        ...cardStyle,
      }}
    >
      {imageSrc ? (
        <div
          style={{
            overflow: "hidden",
            borderBottom: "2px solid var(--border)",
            position: "relative",
            width: "100%",
            height: `${imageHeight}px`,
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 1200px) 1200px, 100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : null}
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px 16px",
            marginBottom: "12px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "var(--font-syne)", lineHeight: 1.3 }}>
            {href ? (
              <Link
                href={href}
                style={{ color: "var(--fg)", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          {meta ? (
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--muted)", fontFamily: "var(--font-space-mono)", whiteSpace: "nowrap" }}>
              {meta}
            </span>
          ) : null}
        </div>
        {children ? (
          <div style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "var(--muted)" }}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
