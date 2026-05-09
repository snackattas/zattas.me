// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumFun {
    public static void main(String[] args) throws Exception {
        WebDriver driver = new ChromeDriver();
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
