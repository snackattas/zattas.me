#!/bin/bash

set -e

EXPECTED_AUTOMATION_TOOL=${EXPECTED_AUTOMATION_TOOL:-}

if [ -z "$EXPECTED_AUTOMATION_TOOL" ]; then
  echo "Error: EXPECTED_AUTOMATION_TOOL must be set"
  exit 1
fi

source /tmp/prepare-env

if [ "$EXPECTED_AUTOMATION_TOOL" = "cypress" ]; then
  cd /tmp
  CHROMIUM_PATH=$(find /home/seluser/playwright-browsers -name "chrome" -type f | head -1)
  /app/node_modules/.bin/cypress run --headless --browser "$CHROMIUM_PATH" --config baseUrl="$TARGET_URL" 2>&1
  EXIT_CODE=$?
else
  node "$TEMP_SCRIPT"
  EXIT_CODE=$?
fi

rm -f "$TEMP_SCRIPT" /tmp/cypress.config.js /tmp/prepare-env
exit $EXIT_CODE
