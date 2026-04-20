const getSiteUrl = () => process.env['NEXT_PUBLIC_SITE_URL'] || 'https://zattas.me';

export const seleniumScripts = {
  python: `# File: selenium_fun.py
# Language: Python

from selenium import webdriver
import getpass
import os

driver = webdriver.Firefox()

try:
    driver.get("${getSiteUrl()}")
    driver.add_cookie({"name": "automation_user", "value": getpass.getuser()})
    driver.add_cookie({"name": "automation_language", "value": "python"})
    driver.maximize_window()
    input("Press Enter to close browser...")
finally:
    try:
        driver.quit()
    except:
        pass
    os._exit(0)`,

  java: `// File: SeleniumFun.java
// Language: Java

import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class SeleniumFun {
    public static void main(String[] args) throws InterruptedException {
        WebDriver driver = new FirefoxDriver();
        driver.get("${getSiteUrl()}");
        
        String username = System.getProperty("user.name");
        driver.manage().addCookie(new Cookie("automation_user", username));
        driver.manage().addCookie(new Cookie("automation_language", "java"));
        
        driver.manage().window().maximize();
        System.out.println("Press Enter to close browser...");
        System.in.read();
        driver.quit();
    }
}`,

  javascript: `// File: selenium_fun.js
// Language: JavaScript (Node.js)

const { Builder } = require('selenium-webdriver');
const os = require('os');

(async function seleniumFun() {
  const driver = await new Builder().forBrowser('firefox').build();
  
  try {
    await driver.get('${getSiteUrl()}');
    await driver.manage().addCookie({
      name: 'automation_user',
      value: os.userInfo().username
    });
    await driver.manage().addCookie({
      name: 'automation_language',
      value: 'javascript'
    });
    await driver.manage().window().maximize();
    
    // Wait for user input
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    await new Promise(resolve => {
      readline.question('Press Enter to close browser...', () => {
        readline.close();
        resolve();
      });
    });
  } finally {
    await driver.quit();
  }
})();`,

  ruby: `# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

driver = Selenium::WebDriver.for :firefox
driver.navigate.to '${getSiteUrl()}'

username = \`whoami\`.chomp
driver.manage.add_cookie(name: 'automation_user', value: username)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize

puts 'Press Enter to close browser...'
gets
driver.quit`,
};
