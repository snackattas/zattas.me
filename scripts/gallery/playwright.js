/**
 * Example Playwright automation script
 * This script demonstrates detecting automation on zattas.me
 */

const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    // Add automation cookies before navigation
    await context.addCookies([
      {
        name: 'automation_user',
        value: 'playwright_user',
        url: 'https://zattas.me'
      },
      {
        name: 'automation_tool',
        value: 'playwright',
        url: 'https://zattas.me'
      },
      {
        name: 'automation_language',
        value: 'javascript',
        url: 'https://zattas.me'
      }
    ]);

    // Navigate to the target site
    await page.goto('https://zattas.me');

    // Wait a bit for detection to trigger
    await page.waitForTimeout(2000);

    console.log('Playwright automation script completed successfully');
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
