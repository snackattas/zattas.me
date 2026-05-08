/**
 * Java Assertion Harness
 * Wraps gallery scripts with detection assertions and JSON output
 *
 * Environment variables:
 *   GALLERY_SCRIPT_PATH - Path to gallery script to test
 *   EXPECTED_TOOL - Expected automation tool (selenium)
 *   TARGET_URL - URL to test against (default: http://localhost:3000)
 *   DETECTION_TIMEOUT_MS - Max time to wait for detection (default: 10000)
 */

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.Cookie;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

public class JavaAssertionHarness {
    private static final String TARGET_URL = System.getenv("TARGET_URL") != null ?
        System.getenv("TARGET_URL") : "http://localhost:3000";
    private static final long DETECTION_TIMEOUT_MS = System.getenv("DETECTION_TIMEOUT_MS") != null ?
        Long.parseLong(System.getenv("DETECTION_TIMEOUT_MS")) : 10000;
    private static final String GALLERY_SCRIPT_PATH = System.getenv("GALLERY_SCRIPT_PATH") != null ?
        System.getenv("GALLERY_SCRIPT_PATH") : "/app/scripts/gallery/java-selenium.java";
    private static final String EXPECTED_TOOL = System.getenv("EXPECTED_TOOL") != null ?
        System.getenv("EXPECTED_TOOL") : "selenium";

    private static final Gson gson = new Gson();

    public static void main(String[] args) {
        runTestWithAssertion();
    }

    private static void runTestWithAssertion() {
        WebDriver driver = null;
        long startTime = System.currentTimeMillis();

        try {
            System.err.println("[TEST] Navigating to " + TARGET_URL);

            // Create Chrome options for headless mode
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");

            // Create driver
            driver = new ChromeDriver(options);

            driver.get(TARGET_URL);

            // Set test detection cookies
            System.err.println("[TEST] Setting automation cookies...");
            driver.manage().addCookie(new Cookie(
                "automation_tool",
                EXPECTED_TOOL,
                "localhost",
                "/",
                null
            ));

            driver.manage().addCookie(new Cookie(
                "automation_user",
                "test_harness",
                "localhost",
                "/",
                null
            ));

            driver.manage().addCookie(new Cookie(
                "automation_language",
                "java",
                "localhost",
                "/",
                null
            ));

            // Refresh to trigger detection
            System.err.println("[TEST] Refreshing to trigger detection...");
            driver.navigate().refresh();

            // Wait for detection with timeout
            long timeoutSeconds = DETECTION_TIMEOUT_MS / 1000;
            System.err.println("[TEST] Waiting for detection (timeout: " + DETECTION_TIMEOUT_MS + "ms)...");

            String detected = null;
            try {
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(DETECTION_TIMEOUT_MS));
                wait.until(d -> {
                    Object result = d.executeScript("return window.__automationDetected?.tool;");
                    return result != null && !result.toString().isEmpty();
                });
                detected = (String) driver.executeScript("return window.__automationDetected?.tool;");
                System.err.println("[TEST] Detection successful: " + detected);
            } catch (Exception e) {
                System.err.println("[TEST] Detection timeout after " + DETECTION_TIMEOUT_MS + "ms");

                // Check cookie as fallback
                try {
                    for (Cookie cookie : driver.manage().getCookies()) {
                        if ("automation_detected".equals(cookie.getName())) {
                            detected = cookie.getValue();
                            System.err.println("[TEST] Cookie check: automation_detected=" + detected);
                            break;
                        }
                    }
                } catch (Exception cookieErr) {
                    System.err.println("[TEST] Cookie check failed: " + cookieErr.getMessage());
                }
            }

            long elapsedMs = System.currentTimeMillis() - startTime;
            boolean passed = EXPECTED_TOOL.equals(detected);

            JsonObject output = new JsonObject();
            output.addProperty("passed", passed);
            output.addProperty("detected", detected);
            output.addProperty("expectedTool", EXPECTED_TOOL);
            output.addProperty("timestamp", Instant.now()
                .atZone(ZoneId.of("UTC"))
                .format(DateTimeFormatter.ISO_INSTANT));
            output.addProperty("elapsedMs", elapsedMs);
            output.addProperty("testScript", GALLERY_SCRIPT_PATH);

            System.out.println(gson.toJson(output));
            System.exit(passed ? 0 : 1);

        } catch (Exception error) {
            long elapsedMs = System.currentTimeMillis() - startTime;

            JsonObject output = new JsonObject();
            output.addProperty("passed", false);
            output.addProperty("expectedTool", EXPECTED_TOOL);
            output.addProperty("error", error.getMessage());
            output.addProperty("timestamp", Instant.now()
                .atZone(ZoneId.of("UTC"))
                .format(DateTimeFormatter.ISO_INSTANT));
            output.addProperty("elapsedMs", elapsedMs);

            System.out.println(gson.toJson(output));
            System.exit(1);

        } finally {
            if (driver != null) {
                try {
                    driver.quit();
                } catch (Exception e) {
                    System.err.println("Error quitting driver: " + e.getMessage());
                }
            }
        }
    }
}
