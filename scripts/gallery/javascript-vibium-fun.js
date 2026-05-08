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

  console.log('\n✅ Done! Check the browser for your haiku.');
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
  console.log('\nClosing...');
  process.exit(0);
});
