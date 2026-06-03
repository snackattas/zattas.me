"use client";

import { useState } from "react";

const SKILLS = [
  "Python", "Pytest", "Playwright", "Selenium", "TypeScript",
  "Kotlin", "Golang", "Ruby", "Docker", "Kubernetes",
  "Temporal Cloud", "Kafka", "RabbitMQ", "Locust", "Grafana",
  "Coveralls", "Percy", "Appium", "Spring Boot", "Django",
  "AWS", "Selenoid", "ReportPortal",
];

export function SkillsMarquee() {
  const [expanded, setExpanded] = useState(false);
  const doubled = [...SKILLS, ...SKILLS];

  return (
    <div
      style={{
        borderTop: "2px solid var(--border)",
        borderBottom: "2px solid var(--border)",
        background: "var(--fg)",
      }}
    >
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .skills-track {
          display: inline-flex;
          animation: marquee 40s linear infinite;
          cursor: pointer;
        }
        .skills-viewall {
          font-family: var(--font-space-mono);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: rgba(250, 248, 244, 0.55);
          background: transparent;
          border: none;
          padding: 6px 16px;
          cursor: pointer;
          text-transform: uppercase;
          transition: color 0.12s ease;
        }
        .skills-viewall:hover {
          color: var(--accent);
        }
        .skills-allgrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(250, 248, 244, 0.12);
        }
        .skills-allgrid span {
          font-family: var(--font-space-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--bg);
          padding: 4px 10px;
          border: 1px solid rgba(250, 248, 244, 0.25);
          letter-spacing: 0.04em;
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          padding: "14px 0",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.querySelector(".skills-track") as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.querySelector(".skills-track") as HTMLElement).style.animationPlayState = "running";
        }}
      >
        <div className="skills-track">
          {doubled.map((skill, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--bg)",
                  padding: "0 20px",
                  letterSpacing: "0.04em",
                }}
              >
                {skill}
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  background: "var(--accent)",
                  verticalAlign: "middle",
                  position: "relative",
                  top: "-1px",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          type="button"
          className="skills-viewall"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "hide ←" : "view all →"}
        </button>
      </div>

      {expanded && (
        <div className="skills-allgrid">
          {SKILLS.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      )}
    </div>
  );
}
