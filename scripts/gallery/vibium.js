/**
 * Example Vibium automation script
 * This script demonstrates detecting automation on zattas.me
 * Vibium provides advanced browser automation capabilities with page_clock support
 */

async function main() {
  const page = await browser.newPage();

  try {
    // Set automation cookies before navigation
    await page.context().addCookies([
      {
        name: 'automation_user',
        value: 'vibium_user',
        url: 'https://zattas.me'
      },
      {
        name: 'automation_tool',
        value: 'selenium', // Start as selenium for initial detection
        url: 'https://zattas.me'
      },
      {
        name: 'automation_language',
        value: 'javascript',
        url: 'https://zattas.me'
      }
    ]);

    // Navigate to the target site
    await page.goto('https://zattas.me');

    // Install Vibium's page_clock for advanced timing control
    await page.evaluate(() => {
      if (window.__vibium) {
        window.__vibium.page_clock_install?.();
      }
    });

    // Wait for detection to trigger
    await page.waitForTimeout(2000);

    // Verify detection was triggered
    const detected = await page.evaluate(() => window.__automationDetected?.tool);
    console.log(`Detected tool: ${detected}`);

    // Check if upgraded to Vibium
    const isVibium = await page.evaluate(() => !!window.__vibiumClock);
    if (isVibium) {
      console.log('Upgraded to Vibium detection');
    }

    console.log('Vibium automation script completed successfully');
  } finally {
    await page.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
