// File: PlaywrightFun.java
// Language: Java

import java.util.Arrays;
import java.util.List;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.Cookie;

public class PlaywrightFun {
    public static void main(String[] args) throws Exception {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(false)
            );
            try {
                BrowserContext context = browser.newContext();
                Page page = context.newPage();

                page.navigate("https://zattas.me");
                context.addCookies(Arrays.asList(
                    new Cookie("automation_user", System.getProperty("user.name"))
                        .setUrl("https://zattas.me"),
                    new Cookie("automation_language", "java")
                        .setUrl("https://zattas.me")
                ));
                page.setViewportSize(1920, 1080);

                System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
                Thread.sleep(300000); // Keep open for 5 minutes
            } catch (InterruptedException e) {
                // Ctrl+C
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
                e.printStackTrace();
            } finally {
                browser.close();
            }
        }
    }
}
