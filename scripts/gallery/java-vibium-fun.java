// File: VibiumFun.java
// Language: Java

import java.util.Map;
import java.util.HashMap;
import com.vibium.browser.Browser;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        try (Browser browser = new Browser()) {
            try {
                var page = browser.navigate("https://zattas.me");

                browser.setCookie("automation_user", System.getProperty("user.name"),
                    "zattas.me", "/");
                browser.setCookie("automation_language", "java",
                    "zattas.me", "/");

                String timezone = java.util.TimeZone.getDefault().getID();
                browser.installPageClock(timezone);

                System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
                Thread.sleep(300000); // Keep open for 5 minutes
            } catch (InterruptedException e) {
                // Ctrl+C
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
