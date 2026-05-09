// File: VibiumFun.java
// Language: Java

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.vibium.Browser;
import com.vibium.BrowserContext;
import com.vibium.Page;
import com.vibium.types.SetCookieParam;
import com.vibium.types.Cookie;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        Browser browser = new Browser();
        try {
            Page page = browser.newPage();
            BrowserContext context = page.context();

            page.navigate("https://zattas.me");

            SetCookieParam userCookie = new SetCookieParam();
            userCookie.name = "automation_user";
            userCookie.value = System.getProperty("user.name");
            userCookie.domain = "zattas.me";
            userCookie.path = "/";

            SetCookieParam langCookie = new SetCookieParam();
            langCookie.name = "automation_language";
            langCookie.value = "java";
            langCookie.domain = "zattas.me";
            langCookie.path = "/";

            context.setCookies(Arrays.asList(userCookie, langCookie));

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
