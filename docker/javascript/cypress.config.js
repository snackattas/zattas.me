const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://zattas.me',
    supportFile: false,
    specPattern: '*.cy.js',
  },
});
