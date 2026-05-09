// TEST: Check automation_detected cookie
const cookies = await page.context().cookies();
const detected = cookies.find(c => c.name === 'automation_detected')?.value;
await browser.close();
process.exit(detected === '{{EXPECTED_TOOL}}' ? 0 : 1);
