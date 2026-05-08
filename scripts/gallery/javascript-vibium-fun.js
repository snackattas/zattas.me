// File: vibium_fun.js
// Language: JavaScript

const { browser } = require('vibium/sync');
const os = require('os');

(async () => {
  const username = os.userInfo().username;
  let browser_instance;

  try {
    // Start browser in headed mode
    browser_instance = browser.start({ headless: false });
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

    console.log('\n✅ Done! Check the browser for your haiku.');
    console.log('Press Ctrl+C to exit.');

    // Keep open for 5 minutes
    await new Promise(resolve => setTimeout(resolve, 300000));
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.error('❌ Error:', error.message);
    }
  } finally {
    if (browser_instance) browser_instance.stop();
  }
})();
