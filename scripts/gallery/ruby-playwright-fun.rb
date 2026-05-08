# File: playwright_fun.rb
# Language: Ruby

require 'playwright'

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  browser = playwright.firefox.launch(headless: false)
  context = browser.new_context
  context.add_cookies([
    { name: 'automation_user', value: `whoami`.chomp, url: 'https://zattas.me' },
    { name: 'automation_language', value: 'ruby', url: 'https://zattas.me' }
  ])
  page = context.new_page
  page.goto('https://zattas.me')
  page.set_viewport_size(width: 1920, height: 1080)
  puts 'Press Enter to close...'
  gets
  browser.close
end
