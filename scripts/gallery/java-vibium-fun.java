// File: VibiumFun.java
// Language: Java

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.vibium.Vibium;
import com.vibium.Browser;
import com.vibium.BrowserContext;
import com.vibium.Page;
import com.vibium.types.SetCookieParam;
import com.vibium.types.Cookie;
import com.vibium.types.StartOptions;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        Browser browser = Vibium.start();
        try {
            Page page = browser.newPage();
            BrowserContext context = page.context();

            page.navigate("https://zattas.me");

            context.setCookies(Arrays.asList(
                new SetCookieParam("automation_user", System.getProperty("user.name"))
                    .domain("zattas.me").path("/"),
                new SetCookieParam("automation_language", "java")
                    .domain("zattas.me").path("/")
            ));

            String timezone = java.util.TimeZone.getDefault().getID();
            page.clock().setTimezone(timezone);
            page.clock().install();

            System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
            Thread.sleep(300000); // Keep open for 5 minutes
        } catch (InterruptedException e) {
            // Ctrl+C
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            browser.stop();
        }
    }
}
