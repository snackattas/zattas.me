// File: SeleniumFun.java
// Language: Java

import java.util.Set;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class SeleniumFun {
    public static void main(String[] args) throws Exception {
        ChromeOptions options = new ChromeOptions();
        // Headless is intentionally not set here. On macOS, passing --headless=false causes Chrome
        // to launch invisibly when started by a background Java process — the opposite of what you'd
        // expect. Omitting the flag entirely lets Chrome default to headed mode and boot visibly.
        WebDriver driver = new ChromeDriver(options);
        try {
            driver.get("https://zattas.me");
            driver.manage().addCookie(new Cookie.Builder("automation_user", System.getProperty("user.name")).build());
            driver.manage().addCookie(new Cookie.Builder("automation_language", "java").build());
            driver.manage().window().maximize();
            System.out.println("Check the browser for your bonus haiku! Press Ctrl+C to exit.");
            Thread.sleep(300000); // Keep open for 5 minutes
        } catch (InterruptedException e) {
            // Ctrl+C
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }
}
