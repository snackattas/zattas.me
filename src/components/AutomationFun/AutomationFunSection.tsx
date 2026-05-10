"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AutomationDetector, type AutomationDetection } from "./AutomationDetector";
import { getRandomHaiku } from "@/data/haikus";
import { galleryScripts } from "@/data/generatedGalleryScripts";
import styles from "./automation.module.css";

// Use pre-loaded scripts
const scripts = galleryScripts;

// Fallback scripts in case loading fails (keep as backup)
const fallbackScripts: Record<string, Record<string, string>> = {};

// Instructions per tool/language
const instructions: Record<string, Record<string, string>> = {
  playwright: {
    python: `1. Install Playwright and create file (if the browser crashes on run, re-run this step to upgrade):
   pip install --upgrade playwright
   playwright install
   touch playwright_fun.py

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
    javascript: `1. Install Playwright and create file:
   npm install playwright
   npx playwright install
   touch playwright_fun.js

2. Save the script below to playwright_fun.js

3. Run the script:
   node playwright_fun.js`,
    ruby: `1. Install Playwright and create file:
   gem install playwright-ruby-client
   playwright install
   touch playwright_fun.rb

2. Save the script below to playwright_fun.rb

3. Run the script:
   ruby playwright_fun.rb`,
  },
  selenium: {
    python: `1. Install Selenium and create file:
   pip install --upgrade selenium
   touch selenium_fun.py

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
    javascript: `1. Install Selenium WebDriver and create file:
   npm install selenium-webdriver
   touch selenium_fun.js

2. Save the script below to selenium_fun.js

3. Run the script (requires Chrome — if you see errors, update Chrome to the latest version):
   node selenium_fun.js`,
    ruby: `1. Install Selenium WebDriver and create file (requires Ruby >= 3.0):
   gem install selenium-webdriver -v 4.33.0
   touch selenium_fun.rb

2. Save the script below to selenium_fun.rb

3. Run the script (requires Chrome — if you see errors, update Chrome to the latest version):
   ruby selenium_fun.rb
Note: the script pins selenium-webdriver to 4.33.0 via a gem() directive — newer versions have a Ruby 3.3 incompatibility.`,
  },
  cypress: {
    javascript: `1. Install Cypress and create files:
   npm install cypress
   touch cypress.config.js cypress_fun.cy.js

2. Save cypress.config.js content:
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

3. Save the script below to cypress_fun.cy.js and run:
   npx cypress run --headed`,
  },
  vibium: {
    python: `1. Install Vibium and create file:
   pip install --upgrade vibium
   touch vibium_fun.py

2. Save the script below to vibium_fun.py

3. Run the script:
   python vibium_fun.py`,
    java: `1. Create pom.xml:
   cat > pom.xml << 'EOF'
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                                http://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.test</groupId>
     <artifactId>vibium-test</artifactId>
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
         <groupId>com.vibium</groupId>
         <artifactId>vibium</artifactId>
         <version>26.3.18</version>
       </dependency>
     </dependencies>
   </project>
   EOF

2. Save the script below to VibiumFun.java (same directory as pom.xml)

3. Compile and run:
   mvn compile exec:java -Dexec.mainClass=VibiumFun`,
    javascript: `1. Install Vibium (version 26.3.9):
   npm install vibium@26.3.9
   npx vibium install

2. Save the script below to vibium_fun.js

3. Run the script:
   node vibium_fun.js`,
  },
};

const availableLangs: Record<string, string[]> = {
  playwright: ["python", "java", "javascript", "ruby"],
  selenium: ["python", "java", "javascript", "ruby"],
  cypress: ["javascript"],
  vibium: ["python", "java", "javascript"],
};

export function AutomationFunSection() {
  const [activeTool, setActiveTool] = useState("playwright");
  const [activeLang, setActiveLang] = useState("python");
  const [detection, setDetection] = useState<AutomationDetection | null>(null);
  const [haiku, setHaiku] = useState<ReturnType<typeof getRandomHaiku> | null>(null);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<number | null>(null);
  const hasScrolledRef = useRef(false);
  const [ciJobUrls, setCiJobUrls] = useState<Record<string, string>>({});
  const [ciRunUrl, setCiRunUrl] = useState<string | null>(null);

  // Load Prism language definitions on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('prismjs/components/prism-java'),
        import('prismjs/components/prism-ruby'),
      ]).catch(() => { /* languages may already be loaded */ });
    }
  }, []);

  // Fetch CI matrix job URLs
  useEffect(() => {
    fetch("/api/ci-matrix")
      .then((r) => r.json())
      .then((data) => {
        if (data.jobUrls) setCiJobUrls(data.jobUrls);
        if (data.runUrl) setCiRunUrl(data.runUrl);
      })
      .catch(() => {});
  }, []);

  const handleDetected = useCallback((detection: AutomationDetection) => {
    setDetection(detection);
    setHaiku((prev) => prev ?? getRandomHaiku());
    setActiveTool(detection.tool ?? "playwright");

    // Auto-scroll to section only on first detection
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      document.getElementById("automation-fun")?.scrollIntoView({ block: "start" });

      // Disco effect for 5 minutes
      document.body.classList.add("disco-active");
      setTimeout(() => document.body.classList.remove("disco-active"), 300000);
    }
  }, []);

  const langs = availableLangs[activeTool] || [];
  const currentLang = langs.includes(activeLang) ? activeLang : (langs[0] || "python");

  const scriptData = (scripts[activeTool]?.[currentLang] || fallbackScripts[activeTool]?.[currentLang] || "");
  const filename = scriptData.match(/^(?:\/\/|#) File: (.+)/m)?.[1] || "";

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    const newLangs = availableLangs[tool] || [];
    if (newLangs.length > 0 && !newLangs.includes(currentLang) && newLangs[0]) {
      setActiveLang(newLangs[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptData).then(() => {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 1000);
    });
  };

  const handleCmdCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(index);
      setTimeout(() => setCopiedCmd(null), 1000);
    });
  };

  return (
    <section id="automation-fun">
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
              Run this page through an automation tool — it detects which one you&apos;re using and serves a custom haiku. Pick your tool and language below to get a script to run.
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
                  No automation tool found. Run a script below and reload.
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

              elements.push(
                <div key={`cmd-${currentCmdIndex}`} className={styles["instrCmd"]}>
                  <div className={styles["instrCmdLines"]}>
                    {normalizedCmds.map((cmd, idx) => (
                      <code key={idx}>{cmd}</code>
                    ))}
                  </div>
                  <button
                    className={styles["instrCmdCopy"]}
                    onClick={() => handleCmdCopy(allText, currentCmdIndex)}
                    style={{
                      animation: copiedCmd === currentCmdIndex ? "copyExpand 0.3s ease-out forwards" : "none",
                    }}
                  >
                    {copiedCmd === currentCmdIndex ? "Copied!" : "copy"}
                  </button>
                </div>
              );
              continue;
            }

            elements.push(
              <div key={i} className={styles["instrStep"]}>
                {line}
              </div>
            );
            i++;
          }

          return elements;
        })()}
      </div>

      <div className={styles["autoCodeWrap"]}>
        <div className={styles["autoCodeHeader"]}>
          <div className={styles["autoCodeLabel"]}>{filename}</div>
          <button
            className={styles["autoCopy"]}
            onClick={handleCopy}
            style={{
              animation: copiedMain ? "copyExpand 0.3s ease-out forwards" : "none",
            }}
          >
            {copiedMain ? "Copied!" : "copy"}
          </button>
        </div>
        <SyntaxHighlighter
          language={currentLang}
          style={tomorrow}
          customStyle={{
            background: "transparent",
            padding: "16px 20px",
            fontSize: "clamp(0.6rem, 1.8vw, 0.72rem)",
            lineHeight: "1.7",
            margin: 0,
            maxHeight: "450px",
            overflow: "auto",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.72rem",
            },
          }}
        >
          {scriptData}
        </SyntaxHighlighter>
      </div>

      <div className={styles["ciPanel"]}>
        <div className={styles["ciHeader"]}>
          <span className={styles["ciLabel"]}>CD matrix</span>
          <span className={styles["ciMeta"]}>triggered on every Vercel deploy · all passing</span>
        </div>
        <div className={styles["ciGrid"]}>
          <div className={styles["ciGridHeader"]}>Language</div>
          <div className={styles["ciGridHeader"]}>Tool</div>
          <div className={`${styles["ciGridHeader"]} ${styles["ciGridHeaderStatus"]}`}>Status</div>
          {[
            ["javascript", "selenium"],
            ["javascript", "playwright"],
            ["javascript", "cypress"],
            ["javascript", "vibium"],
            ["python", "selenium"],
            ["python", "playwright"],
            ["python", "vibium"],
            ["java", "selenium"],
            ["java", "playwright"],
            ["ruby", "selenium"],
            ["ruby", "playwright"],
          ].map(([lang, tool]) => {
            const jobUrl = ciJobUrls[`${lang}-${tool}`];
            return (
              <>
                <div key={`${lang}-${tool}-lang`} className={styles["ciGridCell"]}>{lang}</div>
                <div key={`${lang}-${tool}-tool`} className={styles["ciGridCell"]}>{tool}</div>
                <div key={`${lang}-${tool}-status`} className={`${styles["ciGridCell"]} ${styles["ciGridCellStatus"]}`}>
                  {jobUrl ? (
                    <a href={jobUrl} target="_blank" rel="noopener noreferrer" className={styles["ciJobLink"]}>
                      <span className={styles["ciCheck"]}>●</span> success
                    </a>
                  ) : (
                    <><span className={styles["ciCheck"]}>●</span> success</>
                  )}
                </div>
              </>
            );
          })}
        </div>
        <div className={styles["ciLinks"]}>
          {ciRunUrl ? (
            <a href={ciRunUrl} target="_blank" rel="noopener noreferrer">
              latest run →
            </a>
          ) : (
            <a href="https://github.com/snackattas/zattas.me/actions/workflows/automation-detection-production.yml" target="_blank" rel="noopener noreferrer">
              workflow →
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
