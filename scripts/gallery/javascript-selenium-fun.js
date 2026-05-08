// File: selenium_fun.js
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
  console.log('\nClosing...');
  process.exit(0);
});
