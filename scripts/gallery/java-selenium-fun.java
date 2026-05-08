// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumFun {
    public static void main(String[] args) throws Exception {
        WebDriver driver = new ChromeDriver();
        driver.get("https://zattas.me");
        driver.manage().addCookie(new Cookie.Builder("automation_user", System.getProperty("user.name")).build());
        driver.manage().addCookie(new Cookie.Builder("automation_language", "java").build());
        driver.manage().window().maximize();
        System.out.println("Browser open. Press Ctrl+C to close.");
        Thread.sleep(300000);  // Keep open for 5 minutes
        driver.quit();
    }
}
