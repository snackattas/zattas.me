/**
 * Example Vibium automation script in Java
 * This script demonstrates detecting automation on zattas.me
 * Vibium provides advanced browser automation with page_clock support
 */

import com.microsoft.playwright.*;

public class JavaVibium {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            BrowserContext context = browser.newContext();

            // Add automation cookies before creating page
            context.addCookies(java.util.Arrays.asList(
                new Cookie()
                    .setName("automation_user")
                    .setValue(System.getProperty("user.name"))
                    .setUrl("https://zattas.me"),
                new Cookie()
                    .setName("automation_tool")
                    .setValue("selenium")  // Start as selenium for initial detection
                    .setUrl("https://zattas.me"),
                new Cookie()
                    .setName("automation_language")
                    .setValue("java")
                    .setUrl("https://zattas.me")
            ));

            Page page = context.newPage();

            // Navigate to the target site
            page.navigate("https://zattas.me");

            // Install Vibium's page_clock for advanced timing control
            try {
                page.evaluate(
                    "() => { if (window.__vibium) window.__vibium.page_clock_install?.(); }"
                );
            } catch (Exception e) {
                // Clock installation may not be available
            }

            // Wait for detection to trigger
            page.waitForTimeout(2000);

            // Verify detection was triggered
            Object detected = page.evaluate("() => window.__automationDetected?.tool");
            System.out.println("Detected tool: " + detected);

            // Check if upgraded to Vibium
            Object isVibium = page.evaluate("() => !!window.__vibiumClock");
            if (Boolean.TRUE.equals(isVibium)) {
                System.out.println("Upgraded to Vibium detection");
            }

            System.out.println("Java Vibium automation script completed successfully");

            context.close();
            browser.close();
        }
    }
}
