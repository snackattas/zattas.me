// TEST: Check automation_detected cookie
const cookies = await driver.manage().getCookies();
const detected = cookies.find(c => c.name === 'automation_detected')?.value;
await driver.quit();
process.exit(detected === '{{EXPECTED_TOOL}}' ? 0 : 1);
