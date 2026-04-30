"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
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
    page = context.new_page()
    try:
        context.add_cookies([
            {"name": "automation_user", "value": getpass.getuser(), "url": "https://zattas.me"},
            {"name": "automation_language", "value": "python", "url": "https://zattas.me"}
        ])
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
    public static void main(String[] args) throws Exception {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.firefox().launch(
                new BrowserType.LaunchOptions().setHeadless(false));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            page.navigate("https://zattas.me");
            context.addCookies(java.util.Arrays.asList(
                new Cookie("automation_user", System.getProperty("user.name")).setUrl("https://zattas.me"),
                new Cookie("automation_language", "java").setUrl("https://zattas.me")));
            page.setViewportSize(1920, 1080);
            System.out.println("Press Enter to close...");
            System.in.read();
            browser.close();
        }
    }
}`,
    javascript: `// File: playwright_fun.js
// Language: JavaScript (Node.js)

const { chromium } = require('playwright');
const os = require('os');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://zattas.me');
  await context.addCookies([
    { name: 'automation_user', value: os.userInfo().username, url: 'https://zattas.me' },
    { name: 'automation_language', value: 'javascript', url: 'https://zattas.me' }
  ]);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.pause();
  await browser.close();
})();`,
    ruby: `# File: playwright_fun.rb
# Language: Ruby

require 'playwright'

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  browser = playwright.firefox.launch(headless: false)
  context = browser.new_context
  page = context.new_page
  page.goto('https://zattas.me')
  context.add_cookies([
    { name: 'automation_user', value: \`whoami\`.chomp, url: 'https://zattas.me' },
    { name: 'automation_language', value: 'ruby', url: 'https://zattas.me' }
  ])
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
import getpass, os

driver = webdriver.Firefox()
try:
    driver.get("https://zattas.me")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    input("Press Enter to close browser...")
finally:
    driver.quit()
    os._exit(0)`,
    java: `// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class SeleniumFun {
    public static void main(String[] args) throws Exception {
        WebDriver driver = new FirefoxDriver();
        driver.get("https://zattas.me");
        driver.manage().addCookie(new Cookie("automation_user", System.getProperty("user.name")));
        driver.manage().addCookie(new Cookie("automation_language", "java"));
        driver.manage().window().maximize();
        System.out.println("Press Enter to close...");
        System.in.read();
        driver.quit();
    }
}`,
    javascript: `// File: selenium_fun.js
// Language: JavaScript (Node.js)

const { Builder } = require('selenium-webdriver');
const os = require('os');

(async function() {
  const driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('https://zattas.me');
    await driver.manage().addCookie({ name: 'automation_user', value: os.userInfo().username });
    await driver.manage().addCookie({ name: 'automation_language', value: 'javascript' });
    await driver.manage().window().maximize();
    const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
    await new Promise(r => readline.question('Press Enter to close...', () => { readline.close(); r(); }));
  } finally {
    await driver.quit();
  }
})();`,
    ruby: `# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

driver = Selenium::WebDriver.for :firefox
driver.navigate.to 'https://zattas.me'
driver.manage.add_cookie(name: 'automation_user', value: \`whoami\`.chomp)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize
puts 'Press Enter to close...'
gets
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
    cy.pause(); // Press Resume in Cypress UI to continue
  });
});`,
  },
  vibium: {
    javascript: `// File: vibium_fun.spec.js
// Language: JavaScript (Vibium)
// Vibium is built on Cypress, so the syntax is similar

describe('Automation Fun', () => {
  it('should trigger the fun experience', () => {
    cy.visit('https://zattas.me');
    cy.setCookie('automation_user', Cypress.env('USER') || 'vibium-user');
    cy.setCookie('automation_language', 'javascript');
    cy.viewport(1920, 1080);
    cy.pause(); // Press Resume in Vibium UI to continue
  });
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
    javascript: `1. Install Playwright and create file:
   npm install playwright
   npx playwright install
   touch playwright_fun.js

2. Save the script below to playwright_fun.js

3. Run the script:
   node playwright_fun.js`,
    ruby: `1. Install Playwright and create file:
   gem install playwright-ruby-client
   npx playwright install
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
    javascript: `1. Install Selenium WebDriver and create file:
   npm install selenium-webdriver
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
    javascript: `1. Install Cypress and create file:
   npm install cypress
   touch cypress_fun.cy.js

2. Save the script below to cypress_fun.cy.js

3. Run the test:
   npx cypress run --spec cypress_fun.cy.js`,
  },
  vibium: {
    javascript: `1. Open Vibium and create a new spec file:
   touch vibium_fun.spec.js

2. Save the script below to vibium_fun.spec.js

3. Run it through the Vibium UI`,
  },
};

const haikus: Record<string, string> = {
  playwright: "async shadows crawl—\npage.goto whispers low,\nawait the reveal",
  selenium: "webdriver.navigate,\nold bones clicking through the DOM—\nfind element: self",
  cypress: "cy.visit begins,\nthe spec file stares back at you:\nflaky or real bug?",
  vibium: "new challenger waits\nbeyond the familiar—\ntest the untested",
};

const availableLangs: Record<string, string[]> = {
  playwright: ["python", "java", "javascript", "ruby"],
  selenium: ["python", "java", "javascript", "ruby"],
  cypress: ["javascript"],
  vibium: ["javascript"],
};

export function AutomationFunSection() {
  const [activeTool, setActiveTool] = useState("playwright");
  const [activeLang, setActiveLang] = useState("python");
  const [detected, setDetected] = useState<string | null>(null);

  useEffect(() => {
    // Bot detection
    function detectTool(): string | null {
      if ((window as any).Cypress) return "cypress";
      if (navigator.webdriver) {
        if ((window as any).__playwright || (window as any).__pw_manual) return "playwright";
        return "selenium";
      }
      return null;
    }

    const detectedTool = detectTool();
    if (detectedTool) {
      setDetected(detectedTool);
      setActiveTool(detectedTool);
      const langs = availableLangs[detectedTool] || [];
      if (langs.length > 0 && !langs.includes("python") && langs[0]) {
        setActiveLang(langs[0]);
      }
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
    navigator.clipboard.writeText(scriptData);
  };

  return (
    <div className={styles["autoContainer"]}>
      <p className={styles["autoDesc"]}>
        Run this page through an automation tool — it detects which one you're using and serves a custom haiku. Pick your tool and language below to get a script to run.
      </p>

      <div className={styles["autoStatus"]} data-detected={detected ? "true" : "false"}>
        <div className={styles["autoStatusIcon"]}>
          {detected ? "🤖" : "👤"}
        </div>
        <div>
          <div className={styles["autoStatusLabel"]}>
            {detected ? `${detected.charAt(0).toUpperCase() + detected.slice(1)} detected` : "Human detected"}
          </div>
          <div className={styles["autoStatusSub"]}>
            {detected ? "You've been found. Here's your haiku." : "No automation tool found. Run a script below and reload."}
          </div>
        </div>
      </div>

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

              elements.push(
                <div key={`cmd-${i}`} className={styles["instrCmd"]}>
                  <div className={styles["instrCmdLines"]}>
                    {normalizedCmds.map((cmd, idx) => (
                      <code key={idx}>{cmd}</code>
                    ))}
                  </div>
                  <button
                    className={styles["instrCmdCopy"]}
                    onClick={() => navigator.clipboard.writeText(allText)}
                  >
                    copy
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
          <button className={styles["autoCopy"]} onClick={handleCopy}>
            copy
          </button>
        </div>
        <SyntaxHighlighter
          language={currentLang}
          style={tomorrow}
          customStyle={{
            background: "transparent",
            padding: "16px 20px",
            fontSize: "0.72rem",
            lineHeight: "1.7",
            margin: 0,
            maxHeight: "280px",
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

      {detected && (
        <div className={styles["autoHaiku"]}>
          <div className={styles["haikuLabel"]}>Your haiku</div>
          <div className={styles["haikuText"]}>
            {haikus[detected]}
          </div>
        </div>
      )}
    </div>
  );
}
