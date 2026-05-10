# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless=false')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = Selenium::WebDriver.for :chrome, options: options
driver.navigate.to 'https://zattas.me'
driver.manage.add_cookie(name: 'automation_user', value: `whoami`.chomp)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize
puts 'Check the browser for your bonus haiku! Press Ctrl+C to exit.'
begin
  sleep(300) # Keep open for 5 minutes
rescue Interrupt
  # Ctrl+C or browser closed
ensure
  driver.quit
end
