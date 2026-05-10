// File: vibium_fun.js
// Language: JavaScript

const { browser } = require('vibium/sync');
const os = require('os');

(async () => {
  const username = os.userInfo().username;

  const browser_instance = browser.start({ headless: false });
  const page = browser_instance.page();

  page.go('https://zattas.me');

  page.context.setCookies([
    { name: 'automation_user', value: username, domain: 'zattas.me', path: '/' },
    { name: 'automation_language', value: 'javascript', domain: 'zattas.me', path: '/' }
  ]);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  page.clock.install({ timezone: timezone });

  console.log('Check the browser for your bonus haiku! Press Ctrl+C to exit.');
  try {
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
  } catch (error) {
    if (error.code !== 'ERR_SCRIPT_EXECUTION_INTERRUPTED') {
      console.error('Error:', error);
    }
  } finally {
    browser_instance.stop();
  }
})();
