// File: vibium_fun.js
// Language: JavaScript

const { browser } = require('vibium/sync');
const os = require('os');

(async () => {
  const username = os.userInfo().username;
  let browser_instance;

  try {
    browser_instance = browser.start({ headless: false });
    const page = browser_instance.page();

    page.context.setCookies([
      { name: 'automation_user', value: username, domain: 'zattas.me', path: '/' },
      { name: 'automation_language', value: 'javascript', domain: 'zattas.me', path: '/' }
    ]);

    page.go('https://zattas.me');

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    page.clock.install({ timezone: timezone });

    console.log('Check the browser for your bonus haiku! Press Ctrl+C to exit.');
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
  } finally {
    if (browser_instance) browser_instance.stop();
  }
})();
