const getSiteUrl = () => process.env['NEXT_PUBLIC_SITE_URL'] || 'https://zattas.me';

export const vibiumScripts = {
  python: '',
  java: '',
  javascript: `// File: vibium_fun.spec.js
// Language: JavaScript (Vibium)
// Vibium is built on Cypress, so the syntax is similar

describe('Automation Fun', () => {
  it('should trigger the fun experience', () => {
    cy.visit('${getSiteUrl()}');
    cy.setCookie('automation_user', Cypress.env('USER') || 'vibium-user');
    cy.setCookie('automation_language', 'javascript');
    cy.viewport(1920, 1080);
    cy.pause(); // Pauses test - press Resume in Vibium UI to continue
  });
});`,
  ruby: '',
};
