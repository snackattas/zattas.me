# File: selenium_fun.rb
# Language: Ruby

gem 'selenium-webdriver', '4.33.0'
require 'selenium-webdriver'

options = Selenium::WebDriver::Chrome::Options.new
# Headless is intentionally not set here. On macOS, passing --headless=false causes Chrome
# to launch invisibly when started by a background Ruby process — the opposite of what you'd
# expect. Omitting the flag entirely lets Chrome default to headed mode and boot visibly.
# Headless
driver = Selenium::WebDriver.for :chrome, options: options
driver.navigate.to 'https://zattas.me'
driver.manage.add_cookie(name: 'automation_user', value: `whoami`.chomp)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize
puts 'Check the browser for your bonus haiku! Press Ctrl+C to exit.'
begin
  sleep(300) # Keep open for 5 minutes
rescue Interrupt
  # Ctrl+C
ensure
  driver.quit
end
