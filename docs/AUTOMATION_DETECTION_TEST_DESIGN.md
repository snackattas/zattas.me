# Automation Detection Testing Framework

## Overview

Build a comprehensive testing suite that validates automation detection across multiple automation tools (Selenium, Playwright, Cypress, Vibium), programming languages (JavaScript, Python, Java, C#), and browser configurations. Use Docker for environment isolation and GitHub Actions for matrix testing across all combinations.

## Goals

1. **Validation**: Ensure automation detection correctly identifies each tool/language combination
2. **Regression Prevention**: Catch detection failures before they reach production
3. **Scalability**: Easy to add new tools, languages, or configurations
4. **Isolation**: Docker containers ensure clean, reproducible test environments
5. **Speed**: Parallel matrix execution in CI

## Architecture

### Test Matrix Dimensions

```
Tools:      Selenium | Playwright | Cypress | Vibium
Languages:  JavaScript | Python | Java | Ruby
Browsers:   Chrome 

Total combinations: 11 test scenarios (some tool/lang combos don't exist)

### Core Concept: Script Reuse

The key insight is **one source of truth for test scripts**:

1. **Public Gallery**: Scripts displayed on the website (using production domain/cookies)
2. **Test Scripts**: Auto-generated copies with domain/cookie substitutions (using localhost)
3. **Assertion Harness**: Language-agnostic assertion wrapper that runs any script and verifies detection

```
scripts/
├── gallery/                    # Public-facing example scripts
│   ├── selenium.js
│   ├── playwright.js
│   ├── python-selenium.py
│   ├── java-selenium.java
│   └── csharp-selenium.cs
│
└── tests/
    ├── transform.sh           # sed/awk script to generate test versions
    ├── assertion-harness/     # Language-specific wrappers
    │   ├── javascript.js
    │   ├── python.py
    │   ├── java.java
    │   └── csharp.cs
    └── temp/                  # Generated test scripts (gitignored)
        ├── selenium.js        # Transformed version of gallery/selenium.js
        ├── playwright.js
        ├── python-selenium.py
        └── ...
```

### Transformation Pipeline

```bash
# 1. Copy gallery script to temp directory
cp scripts/gallery/selenium.js scripts/tests/temp/selenium.js

# 2. Transform for localhost testing
sed -i 's|https://zattas.me|http://localhost:3000|g' scripts/tests/temp/selenium.js
sed -i "s|domain: 'zattas.me'|domain: 'localhost'|g" scripts/tests/temp/selenium.js

# 3. Wrap with assertion harness (language-specific)
# The wrapper imports/requires the transformed script and verifies detection
```

### Core Components

#### 1. Detection State Tracking

When automation is detected client-side, set both:

- **Cookie**: `automation_detected=<tool>` (persistent across navigations)
- **Window property**: `window.__automationDetected = { tool, timestamp, userAgent }`

This allows test scripts to verify detection via:
- Cookie reads (HTTP requests)
- Direct JS evaluation (browser evaluation)

#### 2. Docker Images

Create language-specific images with automation tools pre-installed:

```
docker/
├── javascript/
│   ├── Dockerfile (Node.js + Selenium + Playwright + Vibium)
│   └── entrypoint.sh
├── python/
│   ├── Dockerfile (Python + Selenium + Playwright)
│   └── entrypoint.sh
├── java/
│   ├── Dockerfile (JDK + Selenium)
│   └── entrypoint.sh
└── csharp/
    ├── Dockerfile (.NET + Selenium)
    └── entrypoint.sh
```

Each image includes:
- Base runtime (Node.js, Python 3.13, JDK 21, .NET 8)
- WebDriver protocol tools (Selenium, Playwright)
- Browser driver management (chromedriver, geckodriver, etc.)
- Test harness code pre-copied

#### 3. Assertion Harness (Language-Agnostic)

Each language has a harness that wraps the gallery script and adds assertions:

```
Input:  gallery/selenium.js  →  Transform  →  temp/selenium.js  →  Assertion Harness
Output: { passed: boolean, detected: string, expectedTool: string, error?: string }
```

The assertion harness:
1. Runs the transformed gallery script (which does the automation)
2. Waits for detection (checks `window.__automationDetected`)
3. Asserts: `detected === expectedTool`
4. Returns JSON result
5. Exits with code 0 (pass) or 1 (fail)

Key: **The gallery script does the work, the harness just wraps it with assertions.**

#### 4. Test Harness Scripts (Assertion Wrappers)

Each language has a harness that:
1. Takes a gallery script path and expected tool name as input
2. Transforms the gallery script (domain/cookie replacements)
3. Launches browser with the target automation tool
4. Runs the transformed script
5. Waits for detection (polls `window.__automationDetected`)
6. Asserts the correct tool was detected
7. Exits with status code (0 = pass, 1 = fail)

Example structure:

```
scripts/
├── gallery/                 # Public-facing examples (shown on website)
│   ├── selenium.js         # Uses https://zattas.me and real cookies
│   ├── playwright.js
│   ├── python-selenium.py
│   ├── java-selenium.java
│   └── csharp-selenium.cs
│
└── tests/
    ├── transform.sh        # Generates temp test versions
    ├── assertion-harness/  # Wraps gallery scripts with assertions
    │   ├── javascript.js
    │   ├── python.py
    │   ├── java.java
    │   └── csharp.cs
    └── temp/               # Generated (gitignored)
        ├── selenium.js     # Transformed: localhost + test cookies
        ├── playwright.js
        └── ...
```

Each assertion harness:
- Accepts env vars: `GALLERY_SCRIPT_PATH`, `EXPECTED_TOOL`, `TARGET_URL`, `DETECTION_TIMEOUT_MS`
- Transforms the gallery script (domain + cookie replacements)
- Runs the gallery script logic
- Verifies detection result
- Outputs JSON: `{ passed: boolean, detected: string, expectedTool: string, error?: string }`
- Returns non-zero exit code on failure

#### 4. GitHub Actions Workflow

Matrix workflow that:
1. Builds matrix of (language, tool, browser)
2. Spins up Docker container for that language
3. Starts your Next.js dev server
4. Runs the test harness inside the container
5. Collects results and reports

```yaml
name: Automation Detection Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: [javascript, python, java, csharp]
        tool: [selenium, playwright, cypress, vibium]
        browser: [chrome, firefox]
        exclude:
          # Cypress only supports Chrome
          - tool: cypress
            browser: firefox
          # Java doesn't have Vibium binding
          - language: java
            tool: vibium
          # C# doesn't have Playwright
          - language: csharp
            tool: playwright
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t test-${{ matrix.language }} ./docker/${{ matrix.language }}
      
      - name: Start dev server
        run: npm run dev &
        env:
          NODE_ENV: test
      
      - name: Wait for dev server
        run: timeout 30 bash -c 'until curl -f http://localhost:3000; do sleep 1; done'
      
      - name: Run test harness
        run: |
          docker run \
            -e TARGET_URL=http://host.docker.internal:3000 \
            -e AUTOMATION_TOOL=${{ matrix.tool }} \
            -e BROWSER=${{ matrix.browser }} \
            -e DETECTION_TIMEOUT_MS=10000 \
            --network host \
            test-${{ matrix.language }} \
            /app/test-harness/${{ matrix.language }}/${{ matrix.tool }}.sh
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.language }}-${{ matrix.tool }}-${{ matrix.browser }}
          path: test-results/
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Add detection state to client (`window.__automationDetected` + cookie)
- [ ] Create JavaScript test harness (Selenium + Playwright)
- [ ] Build JavaScript Docker image
- [ ] Set up basic GitHub Actions workflow

### Phase 2: Expand Coverage (Week 2)
- [ ] Add Python test harness (Selenium + Playwright)
- [ ] Build Python Docker image
- [ ] Add Cypress harness (JavaScript)
- [ ] Add Vibium harness (JavaScript)

### Phase 3: Additional Languages (Week 3)
- [ ] Add Java test harness (Selenium)
- [ ] Build Java Docker image
- [ ] Add C# test harness (Selenium)
- [ ] Build C# Docker image

### Phase 4: Polish (Week 4)
- [ ] Dashboard/reporting of results
- [ ] Retry logic for flaky tests
- [ ] Performance metrics (detection latency)
- [ ] Documentation

## Detection State API

When detection succeeds, set:

```javascript
// Client-side (in detectAutomationTool() or after callback)
window.__automationDetected = {
  tool: 'vibium' | 'selenium' | 'playwright' | 'cypress',
  timestamp: Date.now(),
  userAgent: navigator.userAgent,
  language: getCookie('automation_language'),
  username: getCookie('automation_user'),
};

// Also set cookie for HTTP-based verification
document.cookie = `automation_detected=${tool}; path=/; max-age=3600`;
```

Test harnesses can verify via:

```javascript
// Browser JS evaluation
const detected = await page.evaluate(() => window.__automationDetected?.tool);

// Cookie check (HTTP request)
const cookie = await page.context().cookies();
const detected = cookie.find(c => c.name === 'automation_detected')?.value;
```

## Dockerfile Example (JavaScript)

```dockerfile
FROM node:24-alpine

RUN apk add --no-cache \
    chromium \
    firefox \
    chromium-chromedriver

WORKDIR /app

# Install test dependencies
RUN npm install -g \
    selenium-webdriver \
    playwright \
    cypress

# Copy test harnesses
COPY test-harness/ ./test-harness/

ENTRYPOINT ["/app/test-harness/entrypoint.sh"]
```

## Example Flow

### 1. Gallery Script (User-Facing)
```javascript
// scripts/gallery/selenium.js
const { Builder, By } = require('selenium-webdriver');

async function main() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  try {
    // Uses production domain - users see this
    await driver.get('https://zattas.me');
    
    // Set real cookies for production
    await driver.manage().addCookie({
      name: 'automation_user',
      value: 'test_user',
      domain: 'zattas.me',
      path: '/'
    });

    await driver.navigate().refresh();
    
    // Script does its thing...
    console.log('Script completed successfully');
  } finally {
    await driver.quit();
  }
}

main();
```

### 2. Transform Script
```bash
#!/bin/bash
# scripts/tests/transform.sh

INPUT_SCRIPT=$1
OUTPUT_SCRIPT=$2
TARGET_URL=${3:-http://localhost:3000}

# Copy and transform
cp "$INPUT_SCRIPT" "$OUTPUT_SCRIPT"
sed -i "s|https://zattas.me|$TARGET_URL|g" "$OUTPUT_SCRIPT"
sed -i "s|domain: 'zattas.me'|domain: 'localhost'|g" "$OUTPUT_SCRIPT"
sed -i "s|domain: \"zattas.me\"|domain: \"localhost\"|g" "$OUTPUT_SCRIPT"
```

### 3. Assertion Harness (Language-Agnostic Pattern)
```javascript
// scripts/tests/assertion-harness/javascript.js
const { Builder } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function runTestWithAssertion(galleryScriptPath, expectedTool) {
  const tempScript = generateTempScript(galleryScriptPath);
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .build();

  try {
    await driver.get(process.env.TARGET_URL || 'http://localhost:3000');
    
    // Run the transformed gallery script
    const scriptContent = fs.readFileSync(tempScript, 'utf8');
    
    // Execute gallery script logic, then check detection
    const result = await driver.executeAsyncScript(`
      ${scriptContent}
      
      // After script completes, wait for detection and return result
      const timeout = ${process.env.DETECTION_TIMEOUT_MS || 5000};
      const start = Date.now();
      
      while (Date.now() - start < timeout) {
        if (window.__automationDetected?.tool) {
          return {
            detected: window.__automationDetected.tool,
            cookie: document.cookie.split('; ').find(c => c.startsWith('automation_detected='))?.split('=')[1],
            timestamp: new Date().toISOString()
          };
        }
        await new Promise(r => setTimeout(r, 100));
      }
      
      throw new Error('Detection timeout');
    `);

    const passed = result.detected === '${expectedTool}';
    const output = {
      passed,
      detected: result.detected,
      expectedTool: '${expectedTool}',
      cookie: result.cookie,
      timestamp: result.timestamp,
    };

    console.log(JSON.stringify(output));
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.log(JSON.stringify({
      passed: false,
      expectedTool: '${expectedTool}',
      error: error.message,
      timestamp: new Date().toISOString(),
    }));
    process.exit(1);
  } finally {
    await driver.quit();
  }
}
```

### 4. GitHub Actions Usage
```yaml
- name: Run test harness
  run: |
    docker run \
      -e TARGET_URL=http://host.docker.internal:3000 \
      -e DETECTION_TIMEOUT_MS=5000 \
      -e GALLERY_SCRIPT_PATH=/app/scripts/gallery/selenium.js \
      -e EXPECTED_TOOL=selenium \
      --network host \
      test-${{ matrix.language }} \
      node /app/scripts/tests/assertion-harness/javascript.js
```

## Success Criteria

- All matrix combinations pass (or are documented as not supported)
- Detection latency < 2 seconds average
- Zero flaky tests (100% pass rate on re-runs)
- Can add new tool/language in < 1 hour

## Future Enhancements

- Dashboard showing detection stats across all tools
- Detect which specific automation feature triggered detection (cookies, globals, user agent)
- Performance benchmarking (detection latency per tool)
- Integration with dependency update bots (auto-test when Selenium/Playwright version bumps)
- Evasion testing (detect when tool tries to hide itself)
