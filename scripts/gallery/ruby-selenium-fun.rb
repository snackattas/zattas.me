# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless=false')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = Selenium::WebDriver.for :chrome, options: options
begin
  driver.navigate.to 'https://zattas.me'
  driver.manage.add_cookie(name: 'automation_user', value: `whoami`.chomp)
  driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
  driver.manage.window.maximize
  puts 'Check the browser for your bonus haiku! Press Ctrl+C to exit.'
  sleep(300) # Keep open for 5 minutes
rescue Interrupt
  # Ctrl+C
rescue Exception => e
  warn "Error: #{e.message}"
  warn e.backtrace.join("\n")
ensure
  driver.quit
end
