/**
 * Example Selenium automation script in Java
 * This script demonstrates detecting automation on zattas.me
 */

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class JavaSelenium {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();

        try {
            // Navigate to the target site
            driver.get("https://zattas.me");

            // Set automation cookies for detection
            driver.manage().addCookie(new org.openqa.selenium.Cookie(
                "automation_user",
                System.getProperty("user.name"),
                "zattas.me",
                "/",
                null
            ));

            driver.manage().addCookie(new org.openqa.selenium.Cookie(
                "automation_tool",
                "selenium",
                "zattas.me",
                "/",
                null
            ));

            driver.manage().addCookie(new org.openqa.selenium.Cookie(
                "automation_language",
                "java",
                "zattas.me",
                "/",
                null
            ));

            // Refresh to trigger detection
            driver.navigate().refresh();

            // Wait for detection to complete
            try {
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
                wait.until(ExpectedConditions.presenceOfElementLocated(By.id("automation-fun-modal")));
            } catch (Exception e) {
                // Modal may not always appear, continue anyway
            }

            System.out.println("Java Selenium automation script completed successfully");

        } finally {
            driver.quit();
        }
    }
}
