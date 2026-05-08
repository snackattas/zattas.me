/**
 * Example Selenium automation script in C#
 * This script demonstrates detecting automation on zattas.me
 */

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;

class CSharpSelenium {
    static void Main(string[] args) {
        IWebDriver driver = new ChromeDriver();

        try {
            // Navigate to the target site
            driver.Navigate().GoToUrl("https://zattas.me");

            // Set automation cookies for detection
            driver.Manage().Cookies.AddCookie(new Cookie(
                "automation_user",
                Environment.UserName
            ) {
                Domain = "zattas.me",
                Path = "/"
            });

            driver.Manage().Cookies.AddCookie(new Cookie(
                "automation_tool",
                "selenium"
            ) {
                Domain = "zattas.me",
                Path = "/"
            });

            driver.Manage().Cookies.AddCookie(new Cookie(
                "automation_language",
                "csharp"
            ) {
                Domain = "zattas.me",
                Path = "/"
            });

            // Refresh to trigger detection
            driver.Navigate().Refresh();

            // Wait for detection to complete
            try {
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
                wait.Until(ExpectedConditions.PresenceOfAllElementsLocatedBy(By.Id("automation-fun-modal")));
            } catch {
                // Modal may not always appear, continue anyway
            }

            Console.WriteLine("C# Selenium automation script completed successfully");

        } finally {
            driver.Quit();
        }
    }
}
