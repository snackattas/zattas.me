/**
 * Example Cypress automation script
 * This script demonstrates detecting automation on zattas.me
 */

describe('Automation Detection Test', () => {
  it('should load zattas.me with automation detection', () => {
    // Set automation cookies before visiting
    cy.visit('https://zattas.me', {
      onBeforeLoad: (win) => {
        win.document.cookie = 'automation_user=cypress_user; path=/; domain=zattas.me';
        win.document.cookie = 'automation_tool=cypress; path=/; domain=zattas.me';
        win.document.cookie = 'automation_language=javascript; path=/; domain=zattas.me';
      }
    });

    // Wait for detection to trigger
    cy.wait(2000);

    // Verify we can access the page
    cy.contains('Zach Attas').should('be.visible');

    console.log('Cypress automation script completed successfully');
  });
});
