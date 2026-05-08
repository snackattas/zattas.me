// File: VibiumFun.java
// Language: Java

import com.vibium.browser.Browser;
import java.util.TimeZone;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        try (Browser browser = new Browser()) {
            var page = browser.navigate("https://zattas.me");

            // Set cookies
            browser.setCookie("automation_user", System.getProperty("user.name"),
                "zattas.me", "/");
            browser.setCookie("automation_language", "java",
                "zattas.me", "/");

            // Install page clock
            String timezone = TimeZone.getDefault().getID();
            browser.installPageClock(timezone);

            System.out.println("\n✅ Done! Check the browser for your haiku.");
            System.out.println("Press Ctrl+C to exit.");

            Thread.sleep(300000);  // Keep open for 5 minutes
        } catch (InterruptedException e) {
            System.out.println("\nClosing...");
            Thread.currentThread().interrupt();
        }
    }
}
