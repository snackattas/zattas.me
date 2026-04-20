const getSiteUrl = () => process.env['NEXT_PUBLIC_SITE_URL'] || 'https://zattas.me';

export const playwrightScripts = {
  python: `# File: playwright_fun.py
# Language: Python

from playwright.sync_api import sync_playwright
import getpass
import os

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    
    try:
        # Set cookies before first navigation
        context.add_cookies([
            {
                "name": "automation_user",
                "value": getpass.getuser(),
                "url": "${getSiteUrl()}"
            },
            {
                "name": "automation_language",
                "value": "python",
                "url": "${getSiteUrl()}"
            }
        ])
        
        page.goto("${getSiteUrl()}")
        page.set_viewport_size({"width": 1920, "height": 1080})
        input("Press Enter to close browser...")
    finally:
        try:
            browser.close()
        except:
            pass
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
            
            page.navigate("${getSiteUrl()}");
            context.addCookies(java.util.Arrays.asList(
                new Cookie("automation_user", System.getProperty("user.name"))
                    .setUrl("${getSiteUrl()}"),
                new Cookie("automation_language", "java")
                    .setUrl("${getSiteUrl()}")
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

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('${getSiteUrl()}');
  await context.addCookies([
    {
      name: 'automation_user',
      value: os.userInfo().username,
      url: '${getSiteUrl()}'
    },
    {
      name: 'automation_language',
      value: 'javascript',
      url: '${getSiteUrl()}'
    }
  ]);
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.pause(); // Keeps browser open
  await browser.close();
})();`,

  ruby: `# File: playwright_fun.rb
# Language: Ruby

require 'playwright'

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  browser = playwright.firefox.launch(headless: false)
  context = browser.new_context
  page = context.new_page
  
  page.goto('${getSiteUrl()}')
  context.add_cookies([
    {
      name: 'automation_user',
      value: \`whoami\`.chomp,
      url: '${getSiteUrl()}'
    },
    {
      name: 'automation_language',
      value: 'ruby',
      url: '${getSiteUrl()}'
    }
  ])
  page.set_viewport_size(width: 1920, height: 1080)
  
  puts 'Press Enter to close browser...'
  gets
  browser.close
end`,
};
