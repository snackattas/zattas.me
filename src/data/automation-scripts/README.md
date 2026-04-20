# Automation Scripts

This directory contains automation scripts for testing the "Automation Fun" feature with various automation tools (Selenium, Playwright, Cypress, Vibium) across multiple programming languages.

## Environment Configuration

All scripts use the `NEXT_PUBLIC_SITE_URL` environment variable to determine which URL to visit:

- **Local Development**: `http://localhost:3000`
- **Production**: `https://zattas.me`

### Setting the Environment Variable

**For local development:**
```bash
export NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production testing:**
```bash
export NEXT_PUBLIC_SITE_URL=https://zattas.me
```

### Language-Specific Examples

**Python:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 python selenium_fun.py
```

**Java:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 java SeleniumFun
```

**JavaScript/Node.js:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 node selenium_fun.js
```

**Ruby:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 ruby selenium_fun.rb
```

**Cypress:**
```bash
npx cypress run --spec cypress_fun.cy.js --env NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Directory Structure

```
automation-scripts/
├── scripts/          # Script code organized by tool
│   ├── selenium.ts
│   ├── playwright.ts
│   ├── cypress.ts
│   └── vibium.ts
├── instructions/     # Installation instructions per tool
│   ├── selenium.ts
│   ├── playwright.ts
│   ├── cypress.ts
│   └── vibium.ts
└── index.ts         # Main exports and helper functions
```

## How It Works

1. User selects an automation tool and programming language in the modal
2. The modal displays the appropriate script code and installation instructions
3. User copies the script and runs it locally
4. The script:
   - Reads `NEXT_PUBLIC_SITE_URL` from environment (defaults to production)
   - Visits the specified URL
   - Sets a cookie with the username
   - Maximizes the window (triggers detection)
5. The `AutomationDetector` component detects the automation tool and displays a personalized haiku

## Adding New Scripts

To add a new automation tool or language:

1. Add the script code to the appropriate file in `scripts/`
2. Add installation instructions to the appropriate file in `instructions/`
3. Update the type definitions in `index.ts` if needed
4. The modal will automatically pick up the new scripts
