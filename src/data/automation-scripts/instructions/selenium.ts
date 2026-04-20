export const seleniumInstructions = {
  python: `1. Install Selenium and create file:
   pip install selenium
   touch selenium_fun.py

2. Save the script below to a file named selenium_fun.py

3. Run the script:
   python selenium_fun.py`,

  java: `1. Add dependency to pom.xml:
   <dependency>
       <groupId>org.seleniumhq.selenium</groupId>
       <artifactId>selenium-java</artifactId>
       <version>4.x.x</version>
   </dependency>

   Or add to build.gradle:
   implementation 'org.seleniumhq.selenium:selenium-java:4.x.x'

2. Create file and save the script below to SeleniumFun.java:
   touch SeleniumFun.java

3. Compile and run:
   javac SeleniumFun.java
   java SeleniumFun`,

  javascript: `1. Install Selenium WebDriver and create file:
   npm install selenium-webdriver
   touch selenium_fun.js

2. Save the script below to selenium_fun.js

3. Run the script:
   node selenium_fun.js`,

  ruby: `1. Install Selenium WebDriver and create file:
   gem install selenium-webdriver
   touch selenium_fun.rb

2. Save the script below to selenium_fun.rb

3. Run the script:
   ruby selenium_fun.rb`,
};
