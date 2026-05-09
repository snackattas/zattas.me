#!/bin/bash
# Docker entrypoint for Java automation tests

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

GALLERY_SCRIPT_PATH="${GALLERY_SCRIPT_DIR}/${LANGUAGE}-${EXPECTED_AUTOMATION_TOOL}-fun.java"

# Transform and run script
TEMP_SCRIPT="/tmp/test-$(date +%s).java"
/app/scripts/tests/transform.sh "$GALLERY_SCRIPT_PATH" "$TEMP_SCRIPT" "$EXPECTED_AUTOMATION_TOOL" "$TARGET_URL"

echo "[TEST] Running transformed script: $GALLERY_SCRIPT_PATH"

# Extract class name from script
JAVA_CLASS=$(grep 'public class' "$TEMP_SCRIPT" | sed 's/.*public class \([^ {]*\).*/\1/' | head -1)

# Create temporary Maven project
TEMP_DIR="/tmp/java_test_$$"
mkdir -p "$TEMP_DIR/src/main/java"
mv "$TEMP_SCRIPT" "$TEMP_DIR/src/main/java/${JAVA_CLASS}.java"
cp /app/docker/java/pom.xml "$TEMP_DIR/pom.xml"

# Compile and run with Maven
cd "$TEMP_DIR"
mvn compile exec:java -Dexec.mainClass="$JAVA_CLASS" -q 2>&1
EXIT_CODE=$?

rm -rf "$TEMP_DIR"
exit $EXIT_CODE
