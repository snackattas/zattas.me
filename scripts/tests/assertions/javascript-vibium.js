// TEST: Check automation_detected cookie
await new Promise(r => setTimeout(r, 2000));
const cookies = await page.evaluate(() => document.cookie);
const cookieObj = cookies.split('; ').reduce((acc, c) => {
  const [k, v] = c.split('=');
  acc[k] = v;
  return acc;
}, {});
console.log('Cookies:', cookieObj);
const detected = cookieObj.automation_detected;
if (detected === '{{EXPECTED_TOOL}}') {
  console.log('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}');
} else {
  console.error('❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got ' + detected);
  process.exit(1);
}
