// TEST: Check automation_detected cookie
await new Promise(r => setTimeout(r, 2000));
const cookies = page.context.cookies();
const cookieObj = cookies.reduce((acc, c) => { acc[c.name] = c.value; return acc; }, {});
console.log('Cookies:', cookieObj);
const detected = cookieObj.automation_detected;
if (detected === '{{EXPECTED_TOOL}}') {
  console.log('✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}');
} else {
  console.error('❌ AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got ' + detected);
  process.exit(1);
}
