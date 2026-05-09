// TEST: Check automation_detected cookie
const cookies = await page.evaluate(() => document.cookie);
const cookieObj = cookies.split('; ').reduce((acc, c) => {
  const [k, v] = c.split('=');
  acc[k] = v;
  return acc;
}, {});
const detected = cookieObj.automation_detected;
process.exit(detected === '{{EXPECTED_TOOL}}' ? 0 : 1);
