"use client";

const SKILLS = [
  "Python", "Pytest", "Playwright", "Selenium", "TypeScript",
  "Kotlin", "Golang", "Ruby", "Docker", "Kubernetes",
  "Temporal Cloud", "Kafka", "RabbitMQ", "Locust", "Grafana",
  "Coveralls", "Percy", "Appium", "Spring Boot", "Django",
  "AWS", "Selenoid", "ReportPortal",
];

export function SkillsMarquee() {
  const doubled = [...SKILLS, ...SKILLS];

  return (
    <div
      aria-hidden="true"
      style={{
        borderTop: "2px solid var(--border)",
        borderBottom: "2px solid var(--border)",
        background: "var(--fg)",
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
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .skills-track {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>

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
            {/* Accent dot separator */}
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
  );
}
