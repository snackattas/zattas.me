"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AutomationDetector, type AutomationDetection } from "./AutomationDetector";
import { getRandomHaiku } from "@/data/haikus";
import styles from "./automation.module.css";

// All scripts per tool/language
const scripts: Record<string, Record<string, string>> = {
  playwright: {
    python: `# File: playwright_fun.py
# Language: Python

from playwright.sync_api import sync_playwright
import getpass, os

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    context = browser.new_context()
    context.add_cookies([
        {"name": "automation_user", "value": getpass.getuser(), "url": "https://zattas.me"},
        {"name": "automation_language", "value": "python", "url": "https://zattas.me"}
    ])
    page = context.new_page()
    try:
        page.goto("https://zattas.me")
        page.set_viewport_size({"width": 1920, "height": 1080})
        input("Press Enter to close browser...")
    finally:
        browser.close()
        os._exit(0)`,
    java: `// File: PlaywrightFun.java
// Language: Java

import com.microsoft.playwright.*;

public class PlaywrightFun {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.firefox().launch(
                new BrowserType.LaunchOptions().setHeadless(false)
            );
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            page.navigate("https://zattas.me");
            context.addCookies(java.util.Arrays.asList(
                new Cookie("automation_user", System.getProperty("user.name"))
                    .setUrl("https://zattas.me"),
                new Cookie("automation_language", "java")
                    .setUrl("https://zattas.me")
            ));
            page.setViewportSize(1920, 1080);

            System.out.println("Press Enter to close browser...");
            System.in.read();
            browser.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
    javascript: `// File: playwright_fun.js
// Language: JavaScript (Node.js)

const { chromium } = require('playwright');
const os = require('os');

let browser;

(async () => {
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    await context.addCookies([
      { name: 'automation_user', value: os.userInfo().username, url: 'https://zattas.me' },
      { name: 'automation_language', value: 'javascript', url: 'https://zattas.me' }
    ]);
    const page = await context.newPage();
    await page.goto('https://zattas.me');
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('Browser open. Press Ctrl+C to close.');
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

let sigintHandled = false;
process.on('SIGINT', async () => {
  if (sigintHandled) return;
  sigintHandled = true;
  console.log('\\nClosing browser...');
  try {
    await browser?.close();
  } catch (error) {
    console.error('Error closing browser:', error.message);
  }
  process.exit(0);
});`,
    ruby: `# File: playwright_fun.rb
# Language: Ruby

require 'playwright'

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  browser = playwright.firefox.launch(headless: false)
  context = browser.new_context
  context.add_cookies([
    { name: 'automation_user', value: \`whoami\`.chomp, url: 'https://zattas.me' },
    { name: 'automation_language', value: 'ruby', url: 'https://zattas.me' }
  ])
  page = context.new_page
  page.goto('https://zattas.me')
  page.set_viewport_size(width: 1920, height: 1080)
  puts 'Press Enter to close...'
  gets
  browser.close
end`,
  },
  selenium: {
    python: `# File: selenium_fun.py
# Language: Python

from selenium import webdriver
import getpass, os, time

driver = webdriver.Chrome()
try:
    driver.get("https://zattas.me")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    print("Browser open. Press Ctrl+C to close.")
    time.sleep(300)  # Keep open for 5 minutes
finally:
    driver.quit()
    os._exit(0)`,
    java: `// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumFun {
    public static void main(String[] args) throws Exception {
        WebDriver driver = new ChromeDriver();
        driver.get("https://zattas.me");
        driver.manage().addCookie(new Cookie.Builder("automation_user", System.getProperty("user.name")).build());
        driver.manage().addCookie(new Cookie.Builder("automation_language", "java").build());
        driver.manage().window().maximize();
        System.out.println("Browser open. Press Ctrl+C to close.");
        Thread.sleep(300000);  // Keep open for 5 minutes
        driver.quit();
    }
}`,
    javascript: `// File: selenium_fun.js
// Language: JavaScript (Node.js)

const { Builder } = require('selenium-webdriver');
const os = require('os');

(async function() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://zattas.me');
    await driver.manage().addCookie({ name: 'automation_user', value: os.userInfo().username });
    await driver.manage().addCookie({ name: 'automation_language', value: 'javascript' });
    await driver.manage().window().maximize();
    console.log('Browser open. Press Ctrl+C to close.');
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
  } finally {
    await driver.quit();
  }
})();

let sigintHandled = false;
process.on('SIGINT', () => {
  if (sigintHandled) return;
  sigintHandled = true;
  console.log('\\nClosing...');
  process.exit(0);
});`,
    ruby: `# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

driver = Selenium::WebDriver.for :chrome
driver.navigate.to 'https://zattas.me'
driver.manage.add_cookie(name: 'automation_user', value: \`whoami\`.chomp)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize
puts 'Browser open. Press Ctrl+C to close.'
sleep(300)  # Keep open for 5 minutes
driver.quit`,
  },
  cypress: {
    javascript: `// File: cypress_fun.cy.js
// Language: JavaScript (Cypress)

describe('Automation Fun', () => {
  it('should trigger the fun experience', () => {
    cy.visit('https://zattas.me');
    cy.setCookie('automation_user', Cypress.env('USER') || 'cypress-user');
    cy.setCookie('automation_language', 'javascript');
    cy.viewport(1920, 1080);
    cy.wait(300000); // Keep browser open for 5 minutes
  });
});`,
  },
  vibium: {
    python: `# File: vibium_fun.py
# Language: Python

import getpass
import time
from datetime import datetime

from vibium import browser

try:
    # Start browser in headed mode with single page
    browser_instance = browser.start(headless=False)
    page = browser_instance.page()

    # Navigate to site first
    page.go('https://zattas.me')

    # Set cookies on the page
    page.context.set_cookies([
        {'name': 'automation_user', 'value': getpass.getuser(), 'domain': 'zattas.me', 'path': '/'},
        {'name': 'automation_language', 'value': 'python', 'domain': 'zattas.me', 'path': '/'}
    ])

    # Install page clock with IANA timezone
    page.clock.install(timezone='America/Chicago')

    print('\\n✅ Done! Check the browser for your haiku.')
    print('Press Ctrl+C to exit.')

    time.sleep(300)  # Keep open for 5 minutes
except KeyboardInterrupt:
    print('\\nClosing...')
finally:
    browser_instance.stop()`,
    java: `// File: VibiumFun.java
// Language: Java

import com.vibium.browser.Browser;
import java.util.TimeZone;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        try (Browser browser = new Browser()) {
            var page = browser.navigate("https://zattas.me");

            // Set cookies
            browser.setCookie("automation_user", System.getProperty("user.name"),
                "zattas.me", "/");
            browser.setCookie("automation_language", "java",
                "zattas.me", "/");

            // Install page clock
            String timezone = TimeZone.getDefault().getID();
            browser.installPageClock(timezone);

            System.out.println("\\n✅ Done! Check the browser for your haiku.");
            System.out.println("Press Ctrl+C to exit.");

            Thread.sleep(300000);  // Keep open for 5 minutes
        } catch (InterruptedException e) {
            System.out.println("\\nClosing...");
            Thread.currentThread().interrupt();
        }
    }
}`,
    javascript: `#!/usr/bin/env node
// File: vibium_fun.js
// Language: JavaScript

const { browser } = require('vibium/sync');
const os = require('os');

const username = os.userInfo().username;

try {
  // Start browser in headed mode
  const browser_instance = browser.start({ headless: false });
  const page = browser_instance.page();

  // Set cookies before navigation
  page.context.setCookies([
    { name: 'automation_user', value: username, domain: 'zattas.me', path: '/' },
    { name: 'automation_language', value: 'javascript', domain: 'zattas.me', path: '/' }
  ]);

  // Navigate to site
  page.go('https://zattas.me');

  // Install page clock with IANA timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  page.clock.install({ timezone: timezone });

  console.log('\\n✅ Done! Check the browser for your haiku.');
  console.log('Press Ctrl+C to exit.');

  // Keep open
  setTimeout(() => {
    browser_instance.stop();
    process.exit(0);
  }, 300000); // 5 minutes
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

process.on('SIGINT', () => {
  console.log('\\nClosing...');
  process.exit(0);
});`,
  },
};

// Instructions per tool/language
const instructions: Record<string, Record<string, string>> = {
  playwright: {
    python: `1. Install Playwright and create file:
   pip install playwright
   playwright install
   touch playwright_fun.py

2. Save the script below to playwright_fun.py

3. Run the script:
   python playwright_fun.py`,
    java: `1. Add to pom.xml or build.gradle:
   <dependency>
       <groupId>com.microsoft.playwright</groupId>
       <artifactId>playwright</artifactId>
       <version>1.x.x</version>
   </dependency>

2. Save the script below to PlaywrightFun.java

3. Compile and run:
   javac PlaywrightFun.java && java PlaywrightFun`,
    javascript: `1. Install Playwright globally and create file:
   npm install -g playwright
   playwright install
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
   pip install selenium
   touch selenium_fun.py

2. Save the script below to selenium_fun.py

3. Run the script:
   python selenium_fun.py`,
    java: `1. Add to pom.xml or build.gradle:
   <dependency>
       <groupId>org.seleniumhq.selenium</groupId>
       <artifactId>selenium-java</artifactId>
       <version>4.x.x</version>
   </dependency>

2. Save the script below to SeleniumFun.java

3. Compile and run:
   javac SeleniumFun.java && java SeleniumFun`,
    javascript: `1. Install Selenium WebDriver globally and create file:
   npm install -g selenium-webdriver
   touch selenium_fun.js

2. Save the script below to selenium_fun.js

3. Run the script:
   node selenium_fun.js`,
    ruby: `1. Install Selenium WebDriver and create file:
   gem install selenium-webdriver
   touch selenium_fun.rb

2. Save the script below to selenium_fun.rb

3. Run the script:
   ruby selenium_fun.rb`,
  },
  cypress: {
    javascript: `1. Install Cypress globally and create files:
   npm install -g cypress
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
   cypress run --headed`,
  },
  vibium: {
    python: `1. Install Vibium and create file:
   pip install vibium
   touch vibium_fun.py

2. Save the script below to vibium_fun.py

3. Run the script:
   python vibium_fun.py`,
    java: `1. Add to pom.xml or build.gradle:
   <dependency>
       <groupId>com.vibium</groupId>
       <artifactId>vibium</artifactId>
       <version>26.3.18</version>
   </dependency>

2. Save the script below to VibiumFun.java

3. Compile and run:
   javac VibiumFun.java && java VibiumFun`,
    javascript: `1. Install Vibium globally (version 26.3.9):
   npm install -g vibium@26.3.9
   vibium install

2. Create and save the script below to vibium_fun.js:
   touch vibium_fun.js

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
  const [haiku, setHaiku] = useState<any>(null);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<number | null>(null);
  const hasScrolledRef = useRef(false);

  // Load Prism language definitions on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        require('prismjs/components/prism-java');
        require('prismjs/components/prism-ruby');
      } catch (e) {
        // Languages may already be loaded
      }
    }
  }, []);

  const handleDetected = useCallback((detection: AutomationDetection) => {
    setDetection(detection);
    setHaiku((prev: any) => prev || getRandomHaiku());
    setActiveTool((detection.tool as any) || "playwright");

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

  const scriptData = scripts[activeTool]?.[currentLang] || "";
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
                (e.currentTarget as any).style.display = "none";
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
              Run this page through an automation tool — it detects which one you're using and serves a custom haiku. Pick your tool and language below to get a script to run.
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

      </div>
    </section>
  );
}
