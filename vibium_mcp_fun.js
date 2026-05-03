#!/usr/bin/env node
// File: vibium_mcp_fun.js
// Language: JavaScript (Vibium CLI)

const { spawn, execSync } = require('child_process');
const os = require('os');
const readline = require('readline');

const username = os.userInfo().username;
const url = `http://localhost:3000`;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Kill any existing vibium processes
console.log('Cleaning up existing Vibium processes...');
try {
  execSync('killall vibium', { stdio: 'ignore' });
  execSync('killall chromedriver', { stdio: 'ignore' });
} catch {
  // No existing processes, that's fine
}

setTimeout(() => {
  // Start vibium mcp server in background
  console.log('Starting Vibium MCP server...');
  const mcp = spawn('vibium', ['mcp', '--verbose']);

  let requestId = 1;
  const pendingRequests = new Map();

  const rl = readline.createInterface({
    input: mcp.stdout
  });

  function sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      const id = requestId++;
      const request = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      console.log(`\nSending (${id}):`, method);
      pendingRequests.set(id, { resolve, reject });
      mcp.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  rl.on('line', (line) => {
    try {
      const response = JSON.parse(line);
      const { id, result, error } = response;

      if (pendingRequests.has(id)) {
        const { resolve, reject } = pendingRequests.get(id);
        pendingRequests.delete(id);

        if (error) {
          console.log(`Response (${id}): Error -`, error.message || error);
          reject(new Error(error.message || JSON.stringify(error)));
        } else {
          if (result?.content?.[0]?.text) {
            console.log(`Response (${id}):`, result.content[0].text);
          } else {
            console.log(`Response (${id}): OK`);
          }
          resolve(result);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  });

  mcp.stderr.on('data', (data) => {
    console.error('MCP stderr:', data.toString());
  });

  (async () => {
    try {
      await delay(1000);
      console.log('\n--- Starting browser session ---');
      await sendRequest('tools/call', {
        name: 'browser_start',
        arguments: {
          headless: false
        }
      });

      await delay(1000);
      console.log('\n--- Navigating to URL ---');
      await sendRequest('tools/call', {
        name: 'browser_navigate',
        arguments: {
          url: url
        }
      });

      await delay(2000);
      console.log('\n--- Installing page clock ---');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log(`Using timezone: ${timezone}`);
      await sendRequest('tools/call', {
        name: 'page_clock_install',
        arguments: {
          timezone: timezone
        }
      });

      await delay(500);
      console.log('\n--- Setting cookies (this triggers detection and scroll) ---');
      const cookieResult1 = await sendRequest('tools/call', {
        name: 'browser_set_cookie',
        arguments: {
          name: 'automation_user',
          value: username,
          domain: 'localhost',
          path: '/'
        }
      });
      console.log('Cookie set: automation_user');

      const cookieResult2 = await sendRequest('tools/call', {
        name: 'browser_set_cookie',
        arguments: {
          name: 'automation_language',
          value: 'javascript',
          domain: 'localhost',
          path: '/'
        }
      });
      console.log('Cookie set: automation_language');

      await delay(1000);
      console.log('\n✅ Done! Check the browser for your haiku.');
      console.log('Press Ctrl+C to exit.');
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  })();

  let sigintHandled = false;
  process.on('SIGINT', () => {
    if (sigintHandled) return;
    sigintHandled = true;
    console.log('\nClosing browser...');

    // Force exit after 3 seconds if cleanup hangs
    const forceExitTimer = setTimeout(() => {
      console.log('Force closing...');
      try {
        execSync('killall "Google Chrome for Testing"', { stdio: 'ignore' });
      } catch {
        // Browser already closed
      }
      mcp.kill();
      process.exit(0);
    }, 3000);

    sendRequest('tools/call', {
      name: 'browser_close',
      arguments: {}
    }).then(() => {
      clearTimeout(forceExitTimer);
      console.log('Browser closed.');
      mcp.kill();
      process.exit(0);
    }).catch((error) => {
      clearTimeout(forceExitTimer);
      console.log('Error closing browser:', error.message);
      try {
        execSync('killall "Google Chrome for Testing"', { stdio: 'ignore' });
      } catch {
        // Browser already closed
      }
      mcp.kill();
      process.exit(1);
    });
  });
}, 500);
