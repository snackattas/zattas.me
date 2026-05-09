#!/bin/bash
# Docker entrypoint for JavaScript automation tests

set -e

# Environment variables
TARGET_URL=${TARGET_URL:-http://localhost:3000}
GALLERY_SCRIPT_PATH=${GALLERY_SCRIPT_PATH:-}
EXPECTED_TOOL=${EXPECTED_TOOL:-}

if [ -z "$GALLERY_SCRIPT_PATH" ] || [ -z "$EXPECTED_TOOL" ]; then
  echo "Error: GALLERY_SCRIPT_PATH and EXPECTED_TOOL must be set"
  exit 1
fi

# Transform and run script
if [ "$EXPECTED_TOOL" = "cypress" ]; then
  TEMP_SCRIPT="/tmp/test-$(date +%s).cy.js"
else
  TEMP_SCRIPT="/tmp/test-$(date +%s).js"
fi
/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_TOOL" "$TARGET_URL"

echo "[TEST] Running transformed script: $GALLERY_SCRIPT_PATH"

# Copy Cypress config to /tmp (ignored by other tools)
cp /app/docker/javascript/cypress.config.js /tmp/cypress.config.js

# Determine how to run based on tool
if [ "$EXPECTED_TOOL" = "cypress" ]; then
  cd /tmp
  CHROMIUM_PATH=$(find /home/seluser/playwright-browsers -name "chrome" -type f | head -1)
  /app/node_modules/.bin/cypress run --headless --browser "$CHROMIUM_PATH" 2>&1
  EXIT_CODE=$?
else
  node "$TEMP_SCRIPT"
  EXIT_CODE=$?
fi

rm -f "$TEMP_SCRIPT" /tmp/cypress.config.js
exit $EXIT_CODE
