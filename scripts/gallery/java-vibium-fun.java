// File: VibiumFun.java
// Language: Java

import java.util.Arrays;
import java.util.List;
import com.vibium.Vibium;
import com.vibium.Browser;
import com.vibium.BrowserContext;
import com.vibium.Page;
import com.vibium.types.SetCookieParam;
import com.vibium.types.Cookie;

public class VibiumFun {
    public static void main(String[] args) throws Exception {
        Browser browser = Vibium.start();
        Page page = browser.page();
        BrowserContext context = page.context();

        page.go("https://zattas.me");

        context.setCookies(Arrays.asList(
            new SetCookieParam("automation_user", System.getProperty("user.name"))
                .domain("zattas.me").path("/"),
            new SetCookieParam("automation_language", "java")
                .domain("zattas.me").path("/")
        ));

        System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
        try {
            Thread.sleep(300000); // Keep open for 5 minutes
        } catch (InterruptedException e) {
            // Ctrl+C
        } finally {
            browser.stop();
        }
    }
}
