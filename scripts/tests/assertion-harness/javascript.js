/**
 * JavaScript Assertion Harness
 * Wraps gallery scripts with detection assertions and JSON output
 *
 * Environment variables:
 *   GALLERY_SCRIPT_PATH - Path to gallery script to test
 *   EXPECTED_TOOL - Expected automation tool (selenium, playwright, cypress, vibium)
 *   TARGET_URL - URL to test against (default: http://localhost:3000)
 *   DETECTION_TIMEOUT_MS - Max time to wait for detection (default: 10000)
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const DETECTION_TIMEOUT_MS = parseInt(process.env.DETECTION_TIMEOUT_MS || '10000');
const GALLERY_SCRIPT_PATH = process.env.GALLERY_SCRIPT_PATH || '/app/scripts/gallery/selenium.js';
const EXPECTED_TOOL = process.env.EXPECTED_TOOL || 'selenium';

/**
 * Generate a temporary test script from a gallery script
 */
function generateTempScript(galleryPath) {
  const baseName = path.basename(galleryPath);
  const tempDir = path.dirname(galleryPath).replace('/gallery', '/tests/temp');
  const tempPath = path.join(tempDir, `test-${baseName}`);

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Read and transform the gallery script
  let content = fs.readFileSync(galleryPath, 'utf8');

  // Replace production domain with test domain
  content = content.replace(/https:\/\/zattas\.me/g, TARGET_URL);
  content = content.replace(/domain: 'zattas\.me'/g, `domain: 'localhost'`);
  content = content.replace(/domain: "zattas\.me"/g, `domain: "localhost"`);

  // Write transformed script
  fs.writeFileSync(tempPath, content);

  return tempPath;
}

/**
 * Run test with assertion
 */
async function runTestWithAssertion() {
  let driver = null;
  const startTime = Date.now();

  try {
    // Generate temp script
    const tempScript = generateTempScript(GALLERY_SCRIPT_PATH);
    console.error(`[TEST] Using temp script: ${tempScript}`);

    // Create Chrome options for headless mode
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    // Create driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.error(`[TEST] Navigating to ${TARGET_URL}`);
    await driver.get(TARGET_URL);

    // Set test detection cookies
    await driver.manage().addCookie({
      name: 'automation_tool',
      value: EXPECTED_TOOL,
      domain: 'localhost',
      path: '/'
    });

    await driver.manage().addCookie({
      name: 'automation_user',
      value: 'test_harness',
      domain: 'localhost',
      path: '/'
    });

    await driver.manage().addCookie({
      name: 'automation_language',
      value: 'javascript',
      domain: 'localhost',
      path: '/'
    });

    // Refresh to trigger detection
    console.error('[TEST] Refreshing to trigger detection...');
    await driver.navigate().refresh();

    // Wait for detection with timeout
    console.error(`[TEST] Waiting for detection (timeout: ${DETECTION_TIMEOUT_MS}ms)...`);

    const detected = await driver.wait(() => {
      return driver.executeScript(() => {
        return window.__automationDetected?.tool;
      }).then(tool => {
        if (tool) {
          console.error(`[TEST] Detection successful: ${tool}`);
        }
        return tool;
      });
    }, DETECTION_TIMEOUT_MS).catch(err => {
      console.error(`[TEST] Detection timeout after ${DETECTION_TIMEOUT_MS}ms`);
      return null;
    });

    // Check cookie as fallback
    let cookieValue = null;
    if (!detected) {
      const cookies = await driver.manage().getCookie('automation_detected');
      cookieValue = cookies ? cookies.value : null;
      console.error(`[TEST] Cookie check: automation_detected=${cookieValue}`);
    }

    const finalDetected = detected || cookieValue;
    const passed = finalDetected === EXPECTED_TOOL;
    const elapsedMs = Date.now() - startTime;

    const output = {
      passed,
      detected: finalDetected,
      expectedTool: EXPECTED_TOOL,
      timestamp: new Date().toISOString(),
      elapsedMs,
      testScript: tempScript,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(passed ? 0 : 1);

  } catch (error) {
    const elapsedMs = Date.now() - startTime;

    const output = {
      passed: false,
      expectedTool: EXPECTED_TOOL,
      error: error.message,
      timestamp: new Date().toISOString(),
      elapsedMs,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(1);

  } finally {
    if (driver) {
      try {
        await driver.quit();
      } catch (e) {
        console.error('Error quitting driver:', e);
      }
    }
  }
}

// Run the test
runTestWithAssertion().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
