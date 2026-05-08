# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

driver = Selenium::WebDriver.for :chrome
driver.navigate.to 'https://zattas.me'
driver.manage.add_cookie(name: 'automation_user', value: `whoami`.chomp)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize
puts 'Browser open. Press Ctrl+C to close.'
sleep(300)  # Keep open for 5 minutes
driver.quit
