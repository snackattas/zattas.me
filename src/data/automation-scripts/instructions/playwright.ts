export const playwrightInstructions = {
  python: `1. Install Playwright and create file:
   pip install playwright
   playwright install
   touch playwright_fun.py

2. Save the script below to playwright_fun.py

3. Run the script:
   python playwright_fun.py`,

  java: `1. Add dependency to pom.xml:
   <dependency>
       <groupId>com.microsoft.playwright</groupId>
       <artifactId>playwright</artifactId>
       <version>1.x.x</version>
   </dependency>

   Or add to build.gradle:
   implementation 'com.microsoft.playwright:playwright:1.x.x'

2. Create file and save the script below to PlaywrightFun.java:
   touch PlaywrightFun.java

3. Compile and run:
   javac PlaywrightFun.java
   java PlaywrightFun`,

  javascript: `1. Install Playwright and create file:
   npm install playwright
   npx playwright install
   touch playwright_fun.js

2. Save the script below to playwright_fun.js

3. Run the script:
   node playwright_fun.js`,

  ruby: `1. Install Playwright and create file:
   gem install playwright-ruby-client
   npx playwright install
   touch playwright_fun.rb

2. Save the script below to playwright_fun.rb

3. Run the script:
   ruby playwright_fun.rb`,
};
