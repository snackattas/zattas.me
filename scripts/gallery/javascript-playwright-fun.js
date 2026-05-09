// File: playwright_fun.js
// Language: JavaScript (Node.js)

const { chromium } = require('playwright');
const os = require('os');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://zattas.me');
    await context.addCookies([
      { name: 'automation_user', value: os.userInfo().username, url: 'https://zattas.me' },
      { name: 'automation_language', value: 'javascript', url: 'https://zattas.me' }
    ]);
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('Check the browser for your bonus haiku! Press Ctrl+C to exit.');
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
  } finally {
    if (browser) await browser.close();
  }
})();
