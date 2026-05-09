// TEST: Check automation_detected cookie
await new Promise(r => setTimeout(r, 2000));
const cookies = await driver.manage().getCookies();
const detected = cookies.find(c => c.name === 'automation_detected')?.value;
await driver.quit();
if (detected === '{{EXPECTED_TOOL}}') {
  console.log('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}');
} else {
  console.error('❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got ' + detected);
  process.exit(1);
}
