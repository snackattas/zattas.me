// TEST: Check automation_detected cookie
cy.wait(2000);
cy.getAllCookies().then((allCookies) => {
  cy.task('log', 'Cookies: ' + JSON.stringify(allCookies));
  cy.getCookie('automation_detected').then((cookie) => {
    const detected = cookie?.value;
    if (detected === '{{EXPECTED_TOOL}}') {
      cy.task('log', '✅ AUTOMATION_DETECTED_VERIFIED: {{EXPECTED_TOOL}}');
    } else {
      throw new Error('AUTOMATION_DETECTED_FAILED: expected {{EXPECTED_TOOL}}, got ' + detected);
    }
  });
});
