// File: PlaywrightFun.java
// Language: Java

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
                    .setUrl("https://zattas.me"),
                new Cookie("automation_language", "java")
                    .setUrl("https://zattas.me")
            ));
            page.setViewportSize(1920, 1080);

            Thread.sleep(300000);  // Keep open for 5 minutes
            browser.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
