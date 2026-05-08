# File: selenium_fun.rb
# Language: Ruby

require 'selenium-webdriver'

driver = Selenium::WebDriver.for :firefox
driver.navigate.to 'https://zattas.me'

username = `whoami`.chomp
driver.manage.add_cookie(name: 'automation_user', value: username)
driver.manage.add_cookie(name: 'automation_language', value: 'ruby')
driver.manage.window.maximize

puts 'Press Enter to close browser...'
gets
driver.quit
