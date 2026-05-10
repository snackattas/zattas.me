#!/bin/bash

set -e

TARGET_URL=${TARGET_URL:-http://localhost:3000}
GALLERY_SCRIPT_DIR=${GALLERY_SCRIPT_DIR:-}
EXPECTED_AUTOMATION_TOOL=${EXPECTED_AUTOMATION_TOOL:-}
LANGUAGE=${LANGUAGE:-}

if [ -z "$GALLERY_SCRIPT_DIR" ] || [ -z "$EXPECTED_AUTOMATION_TOOL" ] || [ -z "$LANGUAGE" ]; then
  echo "Error: GALLERY_SCRIPT_DIR, EXPECTED_AUTOMATION_TOOL, and LANGUAGE must be set"
  exit 1
fi

GALLERY_SCRIPT_PATH="${GALLERY_SCRIPT_DIR}/${LANGUAGE}-${EXPECTED_AUTOMATION_TOOL}-fun.js"

if [ "$EXPECTED_AUTOMATION_TOOL" = "cypress" ]; then
  TEMP_SCRIPT="/tmp/test-$(date +%s).cy.js"
else
  TEMP_SCRIPT="/tmp/test-$(date +%s).js"
fi

echo "TEMP_SCRIPT=$TEMP_SCRIPT" > /tmp/prepare-env

/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_AUTOMATION_TOOL" "$TARGET_URL"

echo ""
echo "===== TRANSFORMED SCRIPT ====="
cat "$TEMP_SCRIPT"
echo "============================="

if [ "$EXPECTED_AUTOMATION_TOOL" = "cypress" ]; then
  cp /app/docker/javascript/cypress.config.js /tmp/cypress.config.js
  echo ""
  echo "===== cypress.config.js ====="
  cat /tmp/cypress.config.js
  echo "============================="
fi
