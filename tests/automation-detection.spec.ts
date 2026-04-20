import { test, expect } from '@playwright/test';

interface AutomationWindow extends Window {
  __automationModalOpened?: boolean;
  __automationDetection?: {
    detected: boolean;
    tool: string;
    username: string;
    language: string;
  };
  Cypress?: {
    version: string;
    env: () => string;
  };
}

test.describe('Automation Detection Tests', () => {
  const baseUrl = 'http://localhost:3000';
  
  test.beforeEach(async ({ page }) => {
    // Clear any previous detection state
    await page.goto(baseUrl);
    await page.evaluate(() => {
      delete (window as unknown as AutomationWindow).__automationModalOpened;
      delete (window as unknown as AutomationWindow).__automationDetection;
    });
  });

  test.describe('Playwright Detection', () => {
    test('Python Playwright - detects automation and opens modal', async ({ page }) => {
      // Set cookies that Python script would set
      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'test-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'python',
          url: baseUrl,
        },
      ]);

      // Navigate to the page
      await page.goto(baseUrl);

      // Wait for modal to open (should happen automatically)
      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      // Verify detection details
      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection).toBeTruthy();
      expect(detection.detected).toBe(true);
      expect(detection.tool).toBe('playwright');
      expect(detection.username).toBe('test-user');
      expect(detection.language).toBe('python');

      // Verify modal is visible
      const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
      await expect(modal).toBeVisible();
    });

    test('JavaScript Playwright - detects automation and opens modal', async ({ page }) => {
      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'test-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'javascript',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);

      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection.tool).toBe('playwright');
      expect(detection.language).toBe('javascript');
    });
  });

  test.describe('Selenium Detection', () => {
    test('Python Selenium - detects automation via navigator.webdriver', async ({ page }) => {
      // Selenium sets navigator.webdriver to true
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => true,
        });
      });

      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'selenium-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'python',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);

      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection.tool).toBe('selenium');
      expect(detection.username).toBe('selenium-user');
      expect(detection.language).toBe('python');
    });

    test('Java Selenium - detects automation', async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => true,
        });
      });

      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'selenium-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'java',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);

      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection.tool).toBe('selenium');
      expect(detection.language).toBe('java');
    });
  });

  test.describe('Cypress Detection', () => {
    test('Cypress - detects automation via window.Cypress', async ({ page }) => {
      // Cypress sets window.Cypress
      await page.addInitScript(() => {
        (window as unknown as AutomationWindow).Cypress = {
          version: '12.0.0',
          env: () => 'test-user',
        };
      });

      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'cypress-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'javascript',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);

      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection.tool).toBe('cypress');
      expect(detection.username).toBe('cypress-user');
      expect(detection.language).toBe('javascript');
    });
  });

  test.describe('Server-Side Detection', () => {
    test('Playwright Firefox - detected via missing zstd in accept-encoding', async ({ browser }) => {
      // Create a new context with Firefox-like headers but missing zstd
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br', // Missing zstd - Playwright indicator
        },
      });

      const page = await context.newPage();

      await page.context().addCookies([
        {
          name: 'automation_user',
          value: 'playwright-user',
          url: baseUrl,
        },
        {
          name: 'automation_language',
          value: 'python',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);

      // Server should detect Playwright via missing zstd
      await page.waitForFunction(
        () => (window as unknown as AutomationWindow).__automationModalOpened === true,
        { timeout: 10000 }
      );

      const detection = await page.evaluate(() => (window as unknown as AutomationWindow).__automationDetection);
      expect(detection.tool).toBe('playwright');
      expect(detection.username).toBe('playwright-user');

      await context.close();
    });
  });

  test.describe('No Detection', () => {
    test('Regular browser - should NOT auto-open modal', async ({ page }) => {
      await page.goto(baseUrl);

      // Wait a bit to ensure modal doesn't open
      await page.waitForTimeout(3000);

      const modalOpened = await page.evaluate(() => (window as unknown as AutomationWindow).__automationModalOpened);
      expect(modalOpened).toBeUndefined();
    });

    test('Missing username cookie - should NOT auto-open modal', async ({ page }) => {
      // Only set language cookie, missing username
      await page.context().addCookies([
        {
          name: 'automation_language',
          value: 'python',
          url: baseUrl,
        },
      ]);

      await page.goto(baseUrl);
      await page.waitForTimeout(3000);

      const modalOpened = await page.evaluate(() => (window as unknown as AutomationWindow).__automationModalOpened);
      expect(modalOpened).toBeUndefined();
    });
  });
});
