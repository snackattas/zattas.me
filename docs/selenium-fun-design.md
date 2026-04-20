# Automation Fun Feature - Design Document

## Overview

The Automation Fun feature is an interactive Easter egg that detects when the website is being accessed via automation tools (Selenium, Playwright, Cypress, or Vibium) and provides a personalized, delightful experience for the automation script runner.

## Original Implementation (Legacy Site)

### Detection Method
- **Selenium Detection**: Used `window.navigator.webdriver` property
- **Cookie Detection**: Looked for a cookie named `"name"` containing the user's username
- **Trigger**: Window resize event (triggered when Selenium maximizes the window)

### User Experience
1. User clicks "Automation Fun" button
2. Modal opens with instructions for running Selenium scripts (Ruby/Python/JavaScript)
3. When automation is detected:
   - Instructions are removed
   - Bouncing Selenium logo appears
   - Personalized welcome message with user's name
   - Random haiku from curated collection (Matsuo Basho, Kobayashi Issa, or Yosa Buson)
   - Background gradually fades to green over 5 seconds
   - Modal auto-opens with the haiku

## New Implementation (Next.js)

### Goals
1. Modernize for Next.js/React architecture
2. Support multiple automation tools: Selenium, Playwright, Cypress, Vibium
3. Maintain the delightful, whimsical user experience
4. Improve code organization and type safety

### Architecture

#### Components

**1. `SeleniumFunModal.tsx`** (Client Component)
- Handles automation detection logic
- Manages modal state
- Displays instructions or personalized message
- Triggers animations

**2. `SeleniumFunButton.tsx`**
- Trigger button for the modal
- Styled to match site design

**3. `haikus.ts`**
- Data file containing haiku collections
- Organized by author
- Utility functions for random selection

**4. `AutomationDetector.tsx`** (Client Component)
- Listens for automation tools
- Manages cookie detection
- Triggers modal when detected

#### Detection Strategy

**Selenium**
- Property: `navigator.webdriver === true`
- Cookie: `automation_user=<username>`
- Trigger: Window resize event

**Playwright**
- Property: `navigator.webdriver === true` (Playwright also sets this)
- Additional check: Could check for Playwright-specific markers if needed
- Cookie: `automation_user=<username>`
- Trigger: Window resize event

**Cypress**
- Property: `window.Cypress` object exists
- Cookie: `automation_user=<username>`
- Trigger: Window resize event OR polling check (Cypress doesn't always trigger resize)

**Vibium**
- Property: `window.Cypress` object exists (Vibium is built on Cypress)
- Cookie: `automation_user=<username>`
- Trigger: Window resize event OR polling check

#### Cookie Format
```javascript
{
  name: "automation_user",
  value: "<username>",
  path: "/"
}
```

### User Flow

#### Normal User Flow
1. User navigates to Selenium Fun section
2. Clicks "Selenium Fun" button
3. Modal opens showing:
   - Tabbed interface with Selenium/Playwright/Cypress/Vibium options
   - Installation instructions
   - Example scripts for each tool
   - Explanation of what will happen

#### Automation User Flow
1. User runs automation script from their machine
2. Script navigates to website
3. Script sets `automation_user` cookie with username
4. Script maximizes window (triggers resize event)
5. Detection logic fires:
   - Checks `navigator.webdriver` or `window.Cypress`
   - Reads `automation_user` cookie
   - If both present, triggers the experience
6. Visual changes:
   - Modal auto-opens
   - Instructions removed
   - Bouncing tool logo appears (Selenium/Playwright/Cypress)
   - Welcome message: "Welcome, automation script runner **{username}**!"
   - Random haiku displayed with author attribution
   - Background color animates to green (5 second fade)

### Example Scripts

#### Selenium

**Python**
```python
from selenium import webdriver
import getpass
import time

driver = webdriver.Firefox()
driver.get("https://zattas.me")
driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
driver.maximize_window()
time.sleep(60)  # Keep browser open for 60 seconds
driver.quit()
```

**Java**
```java
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class SeleniumFun {
    public static void main(String[] args) throws InterruptedException {
        WebDriver driver = new FirefoxDriver();
        driver.get("https://zattas.me");
        
        String username = System.getProperty("user.name");
        Cookie cookie = new Cookie("automation_user", username);
        driver.manage().addCookie(cookie);
        
        driver.manage().window().maximize();
        Thread.sleep(60000); // Keep browser open for 60 seconds
        driver.quit();
    }
}
```

**JavaScript (Node.js)**
```javascript
const { Builder } = require('selenium-webdriver');
const os = require('os');

(async function seleniumFun() {
  const driver = await new Builder().forBrowser('firefox').build();
  
  try {
    await driver.get('https://zattas.me');
    await driver.manage().addCookie({
      name: 'automation_user',
      value: os.userInfo().username
    });
    await driver.manage().window().maximize();
    await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds
  } finally {
    await driver.quit();
  }
})();
```

**Ruby**
```ruby
require 'selenium-webdriver'

driver = Selenium::WebDriver.for :firefox
driver.navigate.to 'https://zattas.me'

username = `whoami`.chomp
driver.manage.add_cookie(name: 'automation_user', value: username)
driver.manage.window.maximize

sleep 60 # Keep browser open for 60 seconds
driver.quit
```

#### Playwright

**Python**
```python
from playwright.sync_api import sync_playwright
import getpass

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://zattas.me")
    context.add_cookies([{
        "name": "automation_user",
        "value": getpass.getuser(),
        "url": "https://zattas.me"
    }])
    page.set_viewport_size({"width": 1920, "height": 1080})
    input("Press Enter to close browser...")
    browser.close()
```

**Java**
```java
import com.microsoft.playwright.*;

public class PlaywrightFun {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.firefox().launch(
                new BrowserType.LaunchOptions().setHeadless(false)
            );
            BrowserContext context = browser.newContext();
            Page page = context.newPage();
            
            page.navigate("https://zattas.me");
            context.addCookies(java.util.Arrays.asList(
                new Cookie("automation_user", System.getProperty("user.name"))
                    .setUrl("https://zattas.me")
            ));
            page.setViewportSize(1920, 1080);
            
            System.out.println("Press Enter to close browser...");
            System.in.read();
            browser.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**JavaScript (Node.js)**
```javascript
const { chromium } = require('playwright');
const os = require('os');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://zattas.me');
  await context.addCookies([{
    name: 'automation_user',
    value: os.userInfo().username,
    url: 'https://zattas.me'
  }]);
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.pause(); // Keeps browser open
  await browser.close();
})();
```

**Ruby**
```ruby
require 'playwright'

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  browser = playwright.firefox.launch(headless: false)
  context = browser.new_context
  page = context.new_page
  
  page.goto('https://zattas.me')
  context.add_cookies([{
    name: 'automation_user',
    value: `whoami`.chomp,
    url: 'https://zattas.me'
  }])
  page.set_viewport_size(width: 1920, height: 1080)
  
  puts 'Press Enter to close browser...'
  gets
  browser.close
end
```

#### Cypress

**JavaScript**
```javascript
describe('Selenium Fun', () => {
  it('should trigger the fun experience', () => {
    cy.visit('https://zattas.me');
    cy.setCookie('automation_user', Cypress.env('USER') || 'cypress-user');
    cy.viewport(1920, 1080);
    cy.wait(60000); // Keep browser open for 1 minute
  });
});
```

#### Vibium

**JavaScript**
```javascript
// Vibium is built on Cypress, so the syntax is similar
describe('Selenium Fun with Vibium', () => {
  it('should trigger the fun experience', () => {
    cy.visit('https://zattas.me');
    cy.setCookie('automation_user', Cypress.env('USER') || 'vibium-user');
    cy.viewport(1920, 1080);
    cy.wait(60000); // Keep browser open for 1 minute
  });
});
```

### Visual Design

#### Modal States

**State 1: Instructions (Default)**
- Title: "Selenium Fun"
- Tabs: Selenium | Playwright | Cypress
- Content per tab:
  - Installation instructions
  - Example script with syntax highlighting
  - "What will happen" explanation
- Close button

**State 2: Detected (Automation Running)**
- Title: "Selenium Fun" (or "Playwright Fun" / "Cypress Fun" based on detection)
- Bouncing logo (animated)
- Welcome message with username
- Haiku display:
  - Italicized haiku text
  - Author attribution
  - Source link (small text)
- Background: Animated green fade
- Close button (or auto-close after 30 seconds?)

#### Animations

**Bouncing Logo**
- CSS keyframe animation
- Bounces vertically
- Position: Top of modal content

**Background Fade**
- Transition from current background to `hsl(119, 100%, 36%)` (green)
- Duration: 5 seconds
- Easing: linear
- Applies to `<body>` element

**Modal Entry**
- Fade in + scale up
- Duration: 300ms
- Easing: ease-out

### Technical Implementation Details

#### Detection Logic (Pseudocode)
```typescript
useEffect(() => {
  let detected = false;
  
  const checkAutomation = () => {
    if (detected) return;
    
    // Check for automation tools
    const isSelenium = navigator.webdriver === true;
    const isPlaywright = navigator.webdriver === true; // Same as Selenium
    const isCypress = typeof window.Cypress !== 'undefined';
    
    if (!isSelenium && !isPlaywright && !isCypress) return;
    
    // Check for cookie
    const username = getCookie('automation_user');
    if (!username) return;
    
    // Detected!
    detected = true;
    triggerExperience(username, detectToolType());
  };
  
  // Listen for resize (Selenium/Playwright maximize window)
  window.addEventListener('resize', checkAutomation);
  
  // Backup: Poll every 500ms for Cypress
  const interval = setInterval(checkAutomation, 500);
  
  return () => {
    window.removeEventListener('resize', checkAutomation);
    clearInterval(interval);
  };
}, []);
```

#### Haiku Data Structure
```typescript
interface Haiku {
  text: string;
  author: string;
}

interface HaikuCollection {
  author: string;
  haikus: string[];
}

const haikuCollections: HaikuCollection[] = [
  {
    author: "Matsuo Basho",
    haikus: [
      "An old pond\nA frog jumps in -\nSplash!",
      // ... more haikus
    ]
  },
  // ... more authors
];
```

### File Structure
```
src/
├── components/
│   ├── mdx/
│   │   └── SeleniumFun/
│   │       ├── SeleniumFunModal.tsx      # Main modal component
│   │       ├── SeleniumFunButton.tsx     # Trigger button
│   │       ├── AutomationDetector.tsx    # Detection logic
│   │       ├── HaikuDisplay.tsx          # Haiku rendering
│   │       └── BouncingLogo.tsx          # Animated logo
├── data/
│   └── haikus.ts                         # Haiku collections
└── utils/
    └── cookies.ts                        # Cookie utilities

content/
└── selenium-fun.mdx                      # Content file

public/
└── images/
    └── automation/
        ├── selenium-logo.png
        ├── playwright-logo.png
        └── cypress-logo.png
```

### Edge Cases & Considerations

1. **Multiple Tools**: If multiple tools are detected (unlikely), prioritize: Cypress > Playwright > Selenium
2. **Cookie Expiry**: Cookie should be session-only (no expiry set)
3. **Mobile**: Disable on mobile devices (automation tools don't run on mobile)
4. **Accessibility**: Ensure modal is keyboard navigable and screen-reader friendly
5. **Performance**: Detection logic should be lightweight and not impact page load
6. **Privacy**: Username is only stored in session cookie, never sent to server

### Testing Strategy

1. **Manual Testing**:
   - Run each example script (Selenium/Playwright/Cypress)
   - Verify detection works
   - Verify animations play correctly
   - Test on different browsers

2. **Unit Tests**:
   - Cookie parsing logic
   - Haiku selection randomness
   - Tool detection logic

3. **Integration Tests**:
   - Modal open/close behavior
   - Animation timing
   - State transitions

### Future Enhancements

1. **More Tools**: Add support for Puppeteer, WebdriverIO
2. **Custom Messages**: Allow users to customize the welcome message
3. **Analytics**: Track how many people use this feature (privacy-respecting)
4. **Easter Eggs**: Add more hidden surprises for different scenarios
5. **Themes**: Different color schemes based on detected tool
6. **Sound**: Optional sound effect when detected (muted by default)

## Implementation Checklist

- [ ] Create haiku data file
- [ ] Build AutomationDetector component
- [ ] Build SeleniumFunModal component
- [ ] Build HaikuDisplay component
- [ ] Build BouncingLogo component
- [ ] Add example scripts to modal
- [ ] Implement background fade animation
- [ ] Add logos for Selenium/Playwright/Cypress
- [ ] Wire up to selenium-fun.mdx
- [ ] Test with all three tools
- [ ] Add to MDX component exports
- [ ] Document usage in README

## References

- Original implementation: `/Users/zacharyattas/code/2zattas.me/zattas.me/homepage/static/js/homepage.js`
- Haiku source: https://github.com/penumbra1/haiku/blob/master/db.json
- Selenium WebDriver docs: https://www.selenium.dev/documentation/webdriver/
- Playwright docs: https://playwright.dev/
- Cypress docs: https://docs.cypress.io/
