// File: selenium_fun.js
// Language: JavaScript (Node.js)

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const os = require('os');

(async function() {
  const options = new chrome.Options().addArguments('--headless=false');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    await driver.get('https://zattas.me');
    await driver.manage().addCookie({ name: 'automation_user', value: os.userInfo().username });
    await driver.manage().addCookie({ name: 'automation_language', value: 'javascript' });
    await driver.manage().window().maximize();
    console.log('Check the browser for your bonus haiku! Press Ctrl+C to exit.');
    await new Promise(r => setTimeout(r, 300000)); // Keep open for 5 minutes
  } catch (error) {
    if (error.code !== 'ERR_SCRIPT_EXECUTION_INTERRUPTED') {
      console.error('Error:', error);
    }
  } finally {
    await driver.quit();
  }
})();
