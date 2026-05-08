// File: cypress_fun.cy.js
// Language: JavaScript (Cypress)

describe('Automation Fun', () => {
  it('should trigger the fun experience', () => {
    cy.visit('https://zattas.me');
    cy.setCookie('automation_user', Cypress.env('USER') || 'cypress-user');
    cy.setCookie('automation_language', 'javascript');
    cy.viewport(1920, 1080);
    cy.pause(); // Pauses test - press Resume in Cypress UI to continue
  });
});
