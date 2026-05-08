// File: VibiumFun.java
// Language: Java
// Vibium is built on Playwright, so the syntax is similar

import com.microsoft.playwright.*;

public class JavaVibiumFun {
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

            System.out.println("Press Enter to close browser...");
            System.in.read();
            browser.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
