// TEST: Check automation_detected cookie
cy.getCookie('automation_detected').then((cookie) => {
  const detected = cookie?.value;
  process.exit(detected === '{{EXPECTED_TOOL}}' ? 0 : 1);
});
