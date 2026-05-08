// File: playwright_fun.js
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
  console.log('\nClosing browser...');
  try {
    await browser?.close();
  } catch (error) {
    console.error('Error closing browser:', error.message);
  }
  process.exit(0);
});
