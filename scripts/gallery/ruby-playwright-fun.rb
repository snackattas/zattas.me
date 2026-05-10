# File: playwright_fun.rb
# Language: Ruby

require 'playwright'

Playwright.create(playwright_cli_executable_path: 'playwright') do |playwright|
  browser = playwright.chromium.launch(headless: false)
  begin
    context = browser.new_context
    page = context.new_page
    page.goto('https://zattas.me')
    context.add_cookies([
      { name: 'automation_user', value: `whoami`.chomp, url: 'https://zattas.me' },
      { name: 'automation_language', value: 'ruby', url: 'https://zattas.me' }
    ])
    page.set_viewport_size(width: 1920, height: 1080)
    puts 'Check the browser for your bonus haiku! Press Ctrl+C to exit.'
    sleep(300) # Keep open for 5 minutes
  rescue Interrupt
    # Ctrl+C
  rescue Exception => e
    warn "Error: #{e.message}"
    warn e.backtrace.join("\n")
  ensure
    browser.close
  end
end
