"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AutomationDetector, type AutomationDetection } from "./AutomationDetector";
import { getRandomHaiku } from "@/data/haikus";
import { galleryScripts } from "@/data/generatedGalleryScripts";
import { Sparkle } from "@/components/Sparkle";
import styles from "./automation.module.css";

// Use pre-loaded scripts
const scripts = galleryScripts;

// Fallback scripts in case loading fails (keep as backup)
const fallbackScripts: Record<string, Record<string, string>> = {};

// Instructions per tool/language
const instructions: Record<string, Record<string, string>> = {
  playwright: {
    python: `1. Install Playwright (if the browser crashes on run, re-run this step to upgrade):
   pip install --upgrade playwright
   playwright install

2. Save the script below to playwright_fun.py

3. Run the script:
   python playwright_fun.py`,
    java: `1. Create pom.xml:
   cat > pom.xml << 'EOF'
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                                http://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.test</groupId>
     <artifactId>playwright-test</artifactId>
     <version>1.0</version>
     <properties>
       <maven.compiler.source>21</maven.compiler.source>
       <maven.compiler.target>21</maven.compiler.target>
     </properties>
     <build>
       <sourceDirectory>.</sourceDirectory>
     </build>
     <dependencies>
       <dependency>
         <groupId>com.microsoft.playwright</groupId>
         <artifactId>playwright</artifactId>
         <version>1.48.0</version>
       </dependency>
     </dependencies>
   </project>
   EOF

2. Install browsers:
   mvn exec:java -e -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install"

3. Save the script below to PlaywrightFun.java (same directory as pom.xml)

4. Compile and run:
   mvn compile exec:java -Dexec.mainClass=PlaywrightFun`,
    javascript: `1. Install Playwright:
   npm install playwright
   npx playwright install

2. Save the script below to playwright_fun.js

3. Run the script:
   node playwright_fun.js`,
    ruby: `1. Install Playwright:
   gem install playwright-ruby-client
   playwright install

2. Save the script below to playwright_fun.rb

3. Run the script:
   ruby playwright_fun.rb`,
  },
  selenium: {
    python: `1. Install Selenium:
   pip install --upgrade selenium

2. Save the script below to selenium_fun.py

3. Run the script (requires Chrome — if you see errors, update Chrome to the latest version):
   python selenium_fun.py`,
    java: `1. Create pom.xml:
   cat > pom.xml << 'EOF'
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                                http://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.test</groupId>
     <artifactId>selenium-test</artifactId>
     <version>1.0</version>
     <properties>
       <maven.compiler.source>21</maven.compiler.source>
       <maven.compiler.target>21</maven.compiler.target>
     </properties>
     <build>
       <sourceDirectory>.</sourceDirectory>
     </build>
     <dependencies>
       <dependency>
         <groupId>org.seleniumhq.selenium</groupId>
         <artifactId>selenium-java</artifactId>
         <version>4.33.0</version>
       </dependency>
     </dependencies>
   </project>
   EOF

2. Save the script below to SeleniumFun.java (same directory as pom.xml)

3. Compile and run (requires Chrome — if you see errors, update Chrome to the latest version):
   mvn compile exec:java -Dexec.mainClass=SeleniumFun`,
    javascript: `1. Install Selenium WebDriver:
   npm install selenium-webdriver

2. Save the script below to selenium_fun.js

3. Run the script (requires Chrome — if you see errors, update Chrome to the latest version):
   node selenium_fun.js`,
    ruby: `1. Install Selenium WebDriver (requires Ruby >= 3.0):
   gem install selenium-webdriver -v 4.33.0

2. Save the script below to selenium_fun.rb

3. Run the script (requires Chrome — if you see errors, update Chrome to the latest version):
   ruby selenium_fun.rb
Note: the script pins selenium-webdriver to 4.33.0 via a gem() directive — newer versions have a Ruby 3.3 incompatibility.`,
  },
  cypress: {
    javascript: `1. Install Cypress:
   npm install cypress

2. Create cypress.config.js:
   cat > cypress.config.js << 'EOF'
   const { defineConfig } = require('cypress');
   module.exports = defineConfig({
     e2e: {
       baseUrl: 'https://zattas.me',
       supportFile: false,
       specPattern: '*.cy.js',
     },
   });
   EOF

3. Save the script below to cypress_fun.cy.js

4. Run the script:
   npx cypress run --headed`,
  },
  vibium: {
    python: `1. Install Vibium:
   pip install --upgrade vibium

2. Save the script below to vibium_fun.py

3. Run the script:
   python vibium_fun.py`,
    javascript: `1. Install Vibium (version 26.3.9):
   npm install vibium@26.3.9
   npx vibium install

2. Save the script below to vibium_fun.js

3. Run the script:
   node vibium_fun.js`,
  },
};

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "earlier";
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

const availableLangs: Record<string, string[]> = {
  playwright: ["python", "java", "javascript", "ruby"],
  selenium: ["python", "java", "javascript", "ruby"],
  cypress: ["javascript"],
  vibium: ["python", "javascript"],
};

export function AutomationFunSection() {
  const [activeTool, setActiveTool] = useState("playwright");
  const [activeLang, setActiveLang] = useState("python");
  const [detection, setDetection] = useState<AutomationDetection | null>(null);
  const [haiku, setHaiku] = useState<ReturnType<typeof getRandomHaiku> | null>(null);
  const [discoActive, setDiscoActive] = useState(false);
  const discoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<number | null>(null);
  const hasScrolledRef = useRef(false);
  type JobConclusion = "success" | "failure" | "cancelled" | "skipped" | "in_progress" | "unknown";
  type CiJob = { url: string; conclusion: JobConclusion };
  const [ciJobs, setCiJobs] = useState<Record<string, CiJob>>({});
  const [ciRunUrl, setCiRunUrl] = useState<string | null>(null);
  const [ciRunConclusion, setCiRunConclusion] = useState<string | null>(null);
  const [ciLastSuccess, setCiLastSuccess] = useState<{ url: string; createdAt: string } | null>(null);
  const [ciError, setCiError] = useState(false);
  const [ciSort, setCiSort] = useState<{ col: "lang" | "tool" | "status"; dir: 1 | -1 } | null>(null);
  const [ciHoveredRow, setCiHoveredRow] = useState<string | null>(null);
  const [ciGridHovered, setCiGridHovered] = useState(false);
  const [ciTooltipPos, setCiTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Load Prism language definitions on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('prismjs/components/prism-java'),
        import('prismjs/components/prism-ruby'),
      ]).catch(() => { /* languages may already be loaded */ });
    }
  }, []);

  // Fetch CI matrix job statuses
  useEffect(() => {
    fetch("/api/ci-matrix")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data.jobs) setCiJobs(data.jobs);
        if (data.runUrl) setCiRunUrl(data.runUrl);
        if (data.runConclusion) setCiRunConclusion(data.runConclusion);
        if (data.lastSuccess) setCiLastSuccess(data.lastSuccess);
        if (data.error) setCiError(true);
      })
      .catch(() => setCiError(true));
  }, []);

  const handleDetected = useCallback((detection: AutomationDetection) => {
    setDetection(detection);
    setHaiku((prev) => prev ?? getRandomHaiku());
    setActiveTool(detection.tool ?? "playwright");

    // Disco effect for 5 minutes — always on detection
    document.body.classList.add("disco-active");
    setDiscoActive(true);
    if (discoTimerRef.current) clearTimeout(discoTimerRef.current);
    discoTimerRef.current = setTimeout(() => {
      document.body.classList.remove("disco-active");
      setDiscoActive(false);
    }, 300000);

    // Auto-scroll to section only on first detection
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      document.getElementById("automation-fun")?.scrollIntoView({ block: "start" });
    }
  }, []);

  const langs = availableLangs[activeTool] || [];
  const currentLang = langs.includes(activeLang) ? activeLang : (langs[0] || "python");

  const scriptData = (scripts[activeTool]?.[currentLang] || fallbackScripts[activeTool]?.[currentLang] || "");

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    const newLangs = availableLangs[tool] || [];
    if (newLangs.length > 0 && !newLangs.includes(currentLang) && newLangs[0]) {
      setActiveLang(newLangs[0]);
    }
  };

const handleCmdCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(index);
      setTimeout(() => setCopiedCmd(null), 1000);
    });
  };

  return (
    <section id="automation-fun">
      {(discoActive || (detection && haiku)) && <Sparkle mode="fullscreen" />}
      <AutomationDetector onDetected={handleDetected} />

      <div className={styles["autoContainer"]}>
        {detection && haiku ? (
          // Bot detected state
          <div className={styles["autoDetectedPanel"]}>
            <div className={styles["autoDetectedStatus"]}>
              <span>
                {detection.tool?.charAt(0).toUpperCase()}{detection.tool?.slice(1)} detected
              </span>
            </div>
            <img
              src={`/images/automation/${detection.tool}-logo.png`}
              alt={detection.tool || "automation tool"}
              className={styles["autoToolLogo"]}
              onError={(e) => {
                const emojiMap: Record<string, string> = {
                  selenium: "🌐",
                  playwright: "🎭",
                  cypress: "🌲",
                  vibium: "⚡",
                };
                e.currentTarget.style.display = "none";
                const emoji = document.createElement("div");
                emoji.textContent = emojiMap[detection.tool || ""] || "🤖";
                emoji.style.fontSize = "88px";
                emoji.style.lineHeight = "1";
                e.currentTarget.parentNode?.insertBefore(emoji, e.currentTarget);
              }}
            />
            <p className={styles["autoGreeting"]}>
              Welcome, automation script runner <strong>{detection.username}</strong>, running{" "}
              <strong>{detection.tool?.charAt(0).toUpperCase()}{detection.tool?.slice(1)}</strong>
              {detection.language && (
                <> with <strong>{detection.language.charAt(0).toUpperCase()}{detection.language.slice(1)}</strong></>
              )}
              !
            </p>
            <div className={styles["autoHaikuBlock"]}>
              <div className={styles["autoHaikuLabel"]}>Your haiku</div>
              <div className={styles["autoHaikuPoem"]}>{haiku.text}</div>
              <div className={styles["autoHaikuAuthor"]}>
                — {haiku.author}{" "}
                <a
                  href="https://github.com/penumbra1/haiku/blob/master/db.json"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  haiku source
                </a>
              </div>
            </div>
          </div>
        ) : (
          // Human state
          <>
            <p className={styles["autoDesc"]}>
              This website can <b>detect if your browser is being driven by an automation tool</b>.<br></br>Pick a tool and language below, run the script using that tool, and claim an <b>AMAZING reward</b>.
            </p>

            <div className={styles["autoStatus"]} data-detected="false">
              <div className={styles["autoStatusIcon"]}>
                👤
              </div>
              <div>
                <div className={styles["autoStatusLabel"]}>
                  Human detected
                </div>
                <div className={styles["autoStatusSub"]}>
                  No automation tool found.
                </div>
              </div>
            </div>
          </>
        )}

        {detection && (
          <p className={styles["autoDesc"]}>
            Want to run a different script? Pick your tool and language below.
          </p>
        )}

        <div className={styles["autoToolTabs"]}>
          {["playwright", "selenium", "cypress", "vibium"].map((tool) => (
            <button
              key={tool}
              className={`${styles["autoTab"]} ${activeTool === tool ? styles["active"] : ""}`}
              onClick={() => handleToolClick(tool)}
              data-tool={tool}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles["autoLangTabs"]}>
          {["python", "java", "javascript", "ruby"].map((lang) => (
            <button
              key={lang}
              className={`${styles["autoLang"]} ${currentLang === lang ? styles["active"] : ""}`}
              onClick={() => setActiveLang(lang)}
              disabled={!langs.includes(lang)}
              data-lang={lang}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

      <div className={styles["autoInstructions"]}>
        {(() => {
          const lines = (instructions[activeTool]?.[currentLang] || "").split("\n");
          const elements = [];
          let i = 0;
          let cmdIndex = 0;

          while (i < lines.length) {
            const line = lines[i];
            if (!line) {
              i++;
              continue;
            }

            if (!line.trim()) {
              elements.push(<div key={i} className={styles["instrBlank"]} />);
              i++;
              continue;
            }

            if (/^\s{3,}\S/.test(line)) {
              const cmdLines: string[] = [];
              while (i < lines.length) {
                const currentLine = lines[i];
                if (!currentLine || !/^\s{3,}\S/.test(currentLine)) break;
                cmdLines.push(currentLine);
                i++;
              }

              const minIndent = Math.min(
                ...cmdLines.map((l) => (l.match(/^(\s*)/) || ["", ""])[1]?.length || 0)
              );
              const normalizedCmds = cmdLines.map((l) => l.slice(minIndent));
              const allText = normalizedCmds.join("\n");
              const currentCmdIndex = cmdIndex;
              cmdIndex++;

              type HeredocDef = { startsWith: string; lang: string; label: string };
              const heredocTypes: HeredocDef[] = [
                { startsWith: "<?xml", lang: "xml", label: "pom.xml" },
                { startsWith: "const { defineConfig }", lang: "javascript", label: "cypress.config.js" },
              ];
              const heredoc = heredocTypes.find((h) => normalizedCmds.some((l) => l.trimStart().startsWith(h.startsWith)));
              if (heredoc) {
                const contentStart = normalizedCmds.findIndex((l) => l.trimStart().startsWith(heredoc.startsWith));
                const eofIdx = normalizedCmds.findIndex((l) => l.trim() === "EOF");
                const shellLines = normalizedCmds.slice(0, contentStart).join("\n");
                const contentLines = normalizedCmds.slice(contentStart, eofIdx === -1 ? undefined : eofIdx).join("\n");
                const afterLines = eofIdx !== -1 ? normalizedCmds.slice(eofIdx).join("\n") : "";
                const shStyle = { background: "transparent", padding: 0, margin: 0, fontSize: "0.72rem", lineHeight: "1.7" };
                const codeProps = { style: { fontFamily: "var(--font-space-mono)" } };
                elements.push(
                  <div key={`cmd-${currentCmdIndex}`} className={styles["instrCmd"]}>
                    <div className={styles["instrCmdLines"]}>
                      <SyntaxHighlighter language="bash" style={tomorrow} customStyle={shStyle} codeTagProps={codeProps}>{shellLines}</SyntaxHighlighter>
                      <details className={styles["instrXmlDetails"]}>
                        <summary className={styles["instrXmlSummary"]}>{heredoc.label} ▸</summary>
                        <SyntaxHighlighter language={heredoc.lang} style={tomorrow} customStyle={{ ...shStyle, padding: "8px 0 0" }} codeTagProps={codeProps}>{contentLines}</SyntaxHighlighter>
                      </details>
                      {afterLines && <SyntaxHighlighter language="bash" style={tomorrow} customStyle={shStyle} codeTagProps={codeProps}>{afterLines}</SyntaxHighlighter>}
                    </div>
                    <button
                      className={styles["instrCmdCopy"]}
                      onClick={() => handleCmdCopy(allText, currentCmdIndex)}
                      style={{ animation: copiedCmd === currentCmdIndex ? "copyExpand 0.3s ease-out forwards" : "none" }}
                    >
                      {copiedCmd === currentCmdIndex ? "Copied!" : "copy"}
                    </button>
                  </div>
                );
              } else {
                elements.push(
                  <div key={`cmd-${currentCmdIndex}`} className={styles["instrCmd"]}>
                    <div className={styles["instrCmdLines"]}>
                      <SyntaxHighlighter language="bash" style={tomorrow} customStyle={{ background: "transparent", padding: 0, margin: 0, fontSize: "0.72rem", lineHeight: "1.7" }} codeTagProps={{ style: { fontFamily: "var(--font-space-mono)" } }}>
                        {allText}
                      </SyntaxHighlighter>
                    </div>
                    <button
                      className={styles["instrCmdCopy"]}
                      onClick={() => handleCmdCopy(allText, currentCmdIndex)}
                      style={{ animation: copiedCmd === currentCmdIndex ? "copyExpand 0.3s ease-out forwards" : "none" }}
                    >
                      {copiedCmd === currentCmdIndex ? "Copied!" : "copy"}
                    </button>
                  </div>
                );
              }
              continue;
            }

            const saveMatch = line.match(/save the script below to (\S+)/i);
            if (saveMatch) {
              const saveFilename = saveMatch[1]!;
              const stepLabel = line.match(/^(\d+\.)/)?.[1] ?? "";
              const heredocText = `cat > ${saveFilename} << 'EOF'\n${scriptData}\nEOF`;
              const scriptCmdIndex = cmdIndex++;
              elements.push(
                <div key={i} className={styles["instrStep"]}>{stepLabel} Create {saveFilename}:</div>
              );
              i++;
              elements.push(
                <div key={`script-wrap-${i}`} className={styles["instrCmd"]}>
                  <div className={styles["instrCmdLines"]} style={{ width: "100%" }}>
                    <SyntaxHighlighter language="bash" style={tomorrow} customStyle={{ background: "transparent", padding: 0, margin: 0, fontSize: "0.72rem", lineHeight: "1.7" }} codeTagProps={{ style: { fontFamily: "var(--font-space-mono)" } }}>
                      {`cat > ${saveFilename} << 'EOF'`}
                    </SyntaxHighlighter>
                    <details className={styles["instrXmlDetails"]}>
                      <summary className={styles["instrXmlSummary"]}>{saveFilename} ▸</summary>
                      <SyntaxHighlighter language={currentLang} style={tomorrow} customStyle={{ background: "transparent", padding: "8px 0 0", margin: 0, fontSize: "0.72rem", lineHeight: "1.7", maxHeight: "400px", overflow: "auto" }} codeTagProps={{ style: { fontFamily: "var(--font-space-mono)" } }}>
                        {scriptData}
                      </SyntaxHighlighter>
                    </details>
                    <SyntaxHighlighter language="bash" style={tomorrow} customStyle={{ background: "transparent", padding: 0, margin: 0, fontSize: "0.72rem", lineHeight: "1.7" }} codeTagProps={{ style: { fontFamily: "var(--font-space-mono)" } }}>
                      {"EOF"}
                    </SyntaxHighlighter>
                  </div>
                  <button
                    className={styles["instrCmdCopy"]}
                    onClick={() => handleCmdCopy(heredocText, scriptCmdIndex)}
                    style={{ animation: copiedCmd === scriptCmdIndex ? "copyExpand 0.3s ease-out forwards" : "none" }}
                  >
                    {copiedCmd === scriptCmdIndex ? "Copied!" : "copy"}
                  </button>
                </div>
              );
            } else {
              elements.push(
                <div key={i} className={styles["instrStep"]}>
                  {line}
                </div>
              );
              i++;
            }
          }

          return elements;
        })()}
      </div>

      <div
        className={styles["ciPanel"]}
        onMouseMove={(e) => setCiTooltipPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setCiTooltipPos(null)}
      >
        {ciTooltipPos && typeof document !== "undefined" && ReactDOM.createPortal(
          <div
            className={styles["ciTooltip"]}
            style={{ left: ciTooltipPos.x + 14, top: ciTooltipPos.y + 14 }}
          >
            {ciGridHovered && <><span className={styles["ciTooltipClick"]}>click any row to open that job in github</span><br /></>}
            every deploy triggers a full matrix of tests, verifying that each combo of automation tool and language correctly trips the detection logic, isn&apos;t mistaken for a human, and claims the <b>AMAZING reward</b>
          </div>,
          document.body
        )}
        <div className={styles["ciHeader"]}>
          <span className={styles["ciLabel"]}>CD matrix <span className={styles["ciLabelHint"]}>[?]</span></span>
          <span className={styles["ciMeta"]}>triggered daily and on every Vercel deploy to production · all passing</span>
        </div>
        <div
          className={styles["ciGrid"]}
          onMouseEnter={() => setCiGridHovered(true)}
          onMouseLeave={() => setCiGridHovered(false)}
        >
          {(["lang", "tool", "status"] as const).map((col) => {
            const active = ciSort?.col === col;
            const handleSort = () =>
              setCiSort(active ? { col, dir: ciSort!.dir === 1 ? -1 : 1 } : { col, dir: 1 });
            const label = col === "lang" ? "Language" : col === "tool" ? "Tool" : "Status";
            return (
              <button key={col} className={`${styles["ciGridHeader"]} ${styles["ciGridHeaderSortable"]} ${active ? styles["ciGridHeaderActive"] : ""} ${col === "status" ? styles["ciGridHeaderStatus"] : ""}`} onClick={handleSort}>
                {label}
                <span className={styles["ciSortIndicator"]}>{active ? (ciSort!.dir === 1 ? " ↑" : " ↓") : " ↕"}</span>
              </button>
            );
          })}
          {Object.entries(scripts).flatMap(([tool, langs]) =>
            Object.keys(langs).map((lang) => [lang, tool])
          ).sort((a, b) => {
            if (!ciSort) return 0;
            const val = (row: string[]) => {
              if (ciSort.col === "lang") return row[0]!;
              if (ciSort.col === "tool") return row[1]!;
              return ciJobs[`${row[0]}-${row[1]}`]?.conclusion ?? "unknown";
            };
            return val(a).localeCompare(val(b)) * ciSort.dir;
          }).map(([lang, tool]) => {
            const job = ciJobs[`${lang}-${tool}`];
            const jobUrl = job?.url;
            const conclusion = job?.conclusion;
            const rowKey = `${lang}-${tool}`;
            const isHovered = ciHoveredRow === rowKey;
            const Cell = jobUrl ? "a" : "div";
            const cellProps = {
              ...(jobUrl ? { href: jobUrl, target: "_blank" as const, rel: "noopener noreferrer" } : {}),
              onMouseEnter: () => setCiHoveredRow(rowKey),
              onMouseLeave: () => setCiHoveredRow(null),
              className: `${jobUrl ? styles["ciGridCellLink"] : styles["ciGridCell"]} ${isHovered ? styles["ciGridRowHovered"] : ""}`,
            };
            const statusGlyph =
              conclusion === "success" ? "●" :
              conclusion === "failure" ? "✕" :
              conclusion === "cancelled" ? "⊘" :
              conclusion === "skipped" ? "–" :
              conclusion === "in_progress" ? "◐" :
              "●";
            const statusLabel = conclusion ?? "success";
            const statusClass =
              conclusion === "failure" ? styles["ciStatusFail"] :
              conclusion === "cancelled" ? styles["ciStatusCancelled"] :
              conclusion === "skipped" ? styles["ciStatusSkipped"] :
              conclusion === "in_progress" ? styles["ciStatusProgress"] :
              styles["ciCheck"];
            return (
              <React.Fragment key={rowKey}>
                <Cell {...cellProps}><img src={`/icons/${lang}_logo.png`} alt="" className={styles["ciToolIcon"]} />{lang}</Cell>
                <Cell {...cellProps}><img src={`/images/automation/${tool}-logo.png`} alt="" className={styles["ciToolIcon"]} />{tool}</Cell>
                <Cell {...cellProps} className={`${jobUrl ? styles["ciGridCellLink"] : styles["ciGridCell"]} ${styles["ciGridCellStatus"]} ${isHovered ? styles["ciGridRowHovered"] : ""}`}>
                  {ciError
                    ? <span className={styles["ciErrorStatus"]}>⚠ github api error — reload</span>
                    : <><span className={statusClass}>{statusGlyph}</span> {statusLabel}</>
                  }
                </Cell>
              </React.Fragment>
            );
          })}
        </div>
        <div className={styles["ciLinks"]}>
          {ciRunUrl ? (
            <a href={ciRunUrl} target="_blank" rel="noopener noreferrer">
              latest run{ciRunConclusion && ciRunConclusion !== "success" ? ` (${ciRunConclusion})` : ""} →
            </a>
          ) : (
            <a href="https://github.com/snackattas/zattas.me/actions/workflows/automation-detection-production.yml" target="_blank" rel="noopener noreferrer">
              workflow →
            </a>
          )}
          {ciLastSuccess && (
            <a href={ciLastSuccess.url} target="_blank" rel="noopener noreferrer">
              last green: {formatRelative(ciLastSuccess.createdAt)} →
            </a>
          )}
          <a
            href="https://github.com/snackattas/zattas.me/blob/main/src/components/AutomationFun/AutomationDetector.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            detection source →
          </a>
        </div>
      </div>

      </div>
    </section>
  );
}
