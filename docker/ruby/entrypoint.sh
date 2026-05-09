#!/bin/bash
# Docker entrypoint for Ruby automation tests

set -e

# Environment variables
TARGET_URL=${TARGET_URL:-http://localhost:3000}
GALLERY_SCRIPT_DIR=${GALLERY_SCRIPT_DIR:-}
EXPECTED_AUTOMATION_TOOL=${EXPECTED_AUTOMATION_TOOL:-}
LANGUAGE=${LANGUAGE:-}

if [ -z "$GALLERY_SCRIPT_DIR" ] || [ -z "$EXPECTED_AUTOMATION_TOOL" ] || [ -z "$LANGUAGE" ]; then
  echo "Error: GALLERY_SCRIPT_DIR, EXPECTED_AUTOMATION_TOOL, and LANGUAGE must be set"
  exit 1
fi

GALLERY_SCRIPT_PATH="${GALLERY_SCRIPT_DIR}/${LANGUAGE}-${EXPECTED_AUTOMATION_TOOL}-fun.rb"

# Transform and run script
TEMP_SCRIPT="/tmp/test-$(date +%s).rb"
/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_AUTOMATION_TOOL" "$TARGET_URL"

echo "[TEST] Running transformed script: $GALLERY_SCRIPT_PATH"

ruby "$TEMP_SCRIPT"
EXIT_CODE=$?

rm -f "$TEMP_SCRIPT"
exit $EXIT_CODE
