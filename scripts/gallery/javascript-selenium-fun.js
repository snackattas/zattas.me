// File: selenium_fun.js
// Language: JavaScript (Node.js)

const { Builder } = require('selenium-webdriver');
const os = require('os');

(async function seleniumFun() {
  const driver = await new Builder().forBrowser('firefox').build();

  try {
    await driver.get('https://zattas.me');
    await driver.manage().addCookie({
      name: 'automation_user',
      value: os.userInfo().username
    });
    await driver.manage().addCookie({
      name: 'automation_language',
      value: 'javascript'
    });
    await driver.manage().window().maximize();

    // Wait for user input
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    await new Promise(resolve => {
      readline.question('Press Enter to close browser...', () => {
        readline.close();
        resolve();
      });
    });
  } finally {
    await driver.quit();
  }
})();
