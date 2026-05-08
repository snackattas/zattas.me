/**
 * Example Selenium automation script
 * This script demonstrates detecting automation on zattas.me
 */

const { Builder, By, until } = require('selenium-webdriver');

async function main() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  try {
    // Navigate to the target site
    await driver.get('https://zattas.me');

    // Set automation cookies for detection
    await driver.manage().addCookie({
      name: 'automation_user',
      value: 'selenium_user',
      domain: 'zattas.me',
      path: '/'
    });

    await driver.manage().addCookie({
      name: 'automation_tool',
      value: 'selenium',
      domain: 'zattas.me',
      path: '/'
    });

    await driver.manage().addCookie({
      name: 'automation_language',
      value: 'javascript',
      domain: 'zattas.me',
      path: '/'
    });

    // Refresh to trigger detection
    await driver.navigate().refresh();

    // Wait for detection to complete
    await driver.wait(until.elementLocated(By.id('automation-fun-modal')), 5000).catch(() => {
      // Modal may not always appear, continue anyway
    });

    console.log('Selenium automation script completed successfully');
  } finally {
    await driver.quit();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
