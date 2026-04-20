# Automation Detection Test Suite

This test suite verifies that the automation detection system correctly identifies different automation tools and automatically opens the modal.

## Setup

1. Install Playwright test dependencies:
```bash
npm install -D @playwright/test
npx playwright install firefox
```

2. Make sure your dev server is running:
```bash
npm run dev
```

## Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in UI mode (interactive):
```bash
npx playwright test --ui
```

Run specific test file:
```bash
npx playwright test tests/automation-detection.spec.ts
```

Run tests with headed browser (see what's happening):
```bash
npx playwright test --headed
```

## What the Tests Verify

### 1. Playwright Detection
- **Python Playwright**: Verifies server-side detection via missing `zstd` in `accept-encoding` header
- **JavaScript Playwright**: Verifies detection with JavaScript language
- Tests check that `window.__automationModalOpened` is set to `true`
- Tests verify detection object contains correct tool, username, and language

### 2. Selenium Detection
- **Python Selenium**: Verifies client-side detection via `navigator.webdriver = true`
- **Java Selenium**: Verifies detection with Java language
- Tests simulate Selenium's `navigator.webdriver` property

### 3. Cypress Detection
- **JavaScript Cypress**: Verifies client-side detection via `window.Cypress` object
- Tests simulate Cypress's global window object

### 4. Server-Side Detection
- **Playwright Firefox**: Verifies server detects Playwright via missing `zstd` compression
- Tests use custom headers to simulate Playwright's Firefox behavior

### 5. Negative Tests
- **Regular browser**: Verifies modal does NOT auto-open for normal users
- **Missing username cookie**: Verifies detection requires username cookie

## Test Indicators

The tests verify automation detection by checking:

1. **Window property**: `window.__automationModalOpened === true`
2. **Detection object**: `window.__automationDetection` contains:
   - `detected: boolean`
   - `tool: 'playwright' | 'selenium' | 'cypress'`
   - `username: string`
   - `language?: 'python' | 'java' | 'javascript' | 'ruby'`

## Test Structure

```typescript
test('Tool - Language', async ({ page }) => {
  // 1. Set cookies (username, language)
  await page.context().addCookies([...]);
  
  // 2. Navigate to page
  await page.goto(baseUrl);
  
  // 3. Wait for modal to open
  await page.waitForFunction(
    () => (window as any).__automationModalOpened === true
  );
  
  // 4. Verify detection details
  const detection = await page.evaluate(() => 
    (window as any).__automationDetection
  );
  expect(detection.tool).toBe('playwright');
  expect(detection.username).toBe('test-user');
  expect(detection.language).toBe('python');
});
```

## Debugging

View test report:
```bash
npx playwright show-report
```

Run with debug mode:
```bash
npx playwright test --debug
```

## CI/CD

The tests are configured to run in CI with:
- Retries: 2 attempts on failure
- Single worker for stability
- Automatic dev server startup
