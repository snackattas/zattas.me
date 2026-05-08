/**
 * Example Playwright automation script in Java
 * This script demonstrates detecting automation on zattas.me
 */

import com.microsoft.playwright.*;

public class JavaPlaywright {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            BrowserContext context = browser.newContext();

            // Add automation cookies before creating page
            context.addCookies(java.util.Arrays.asList(
                new Cookie()
                    .setName("automation_user")
                    .setValue("playwright_user")
                    .setUrl("https://zattas.me"),
                new Cookie()
                    .setName("automation_tool")
                    .setValue("playwright")
                    .setUrl("https://zattas.me"),
                new Cookie()
                    .setName("automation_language")
                    .setValue("java")
                    .setUrl("https://zattas.me")
            ));

            Page page = context.newPage();

            // Navigate to the target site
            page.navigate("https://zattas.me");

            // Wait a bit for detection to trigger
            page.waitForTimeout(2000);

            System.out.println("Java Playwright automation script completed successfully");

            context.close();
            browser.close();
        }
    }
}
