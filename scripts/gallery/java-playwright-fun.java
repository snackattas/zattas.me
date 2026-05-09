// File: PlaywrightFun.java
// Language: Java

import com.microsoft.playwright.*;

public class PlaywrightFun {
    public static void main(String[] args) throws Exception {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.firefox().launch(
                new BrowserType.LaunchOptions().setHeadless(false)
            );
            try {
                BrowserContext context = browser.newContext();
                Page page = context.newPage();

                page.navigate("https://zattas.me");
                context.addCookies(java.util.Arrays.asList(
                    new Cookie("automation_user", System.getProperty("user.name"))
                        .setUrl("https://zattas.me"),
                    new Cookie("automation_language", "java")
                        .setUrl("https://zattas.me")
                ));
                page.setViewportSize(1920, 1080);

                System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
                Thread.sleep(300000); // Keep open for 5 minutes
            } finally {
                browser.close();
            }
        }
    }
}
