// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class JavaSeleniumFun {
    public static void main(String[] args) throws InterruptedException {
        WebDriver driver = new FirefoxDriver();
        driver.get("https://zattas.me");

        String username = System.getProperty("user.name");
        driver.manage().addCookie(new Cookie("automation_user", username));
        driver.manage().addCookie(new Cookie("automation_language", "java"));

        driver.manage().window().maximize();
        System.out.println("Press Enter to close browser...");
        System.in.read();
        driver.quit();
    }
}
