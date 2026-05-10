#!/bin/bash
# Transform gallery scripts for testing:
# 1. Replace https://zattas.me with localhost
# 2. Switch headless=false/headless: false to true (all case variants)
# 3. Replace "keep open" line with cookie detection assertion from assertion files
# Output: transformed script that exits 0 if cookie matches, 1 otherwise

set -e

INPUT_SCRIPT=$1
OUTPUT_SCRIPT=$2
EXPECTED_TOOL=${3:-selenium}
TARGET_URL=${4:-http://localhost:3000}

if [ -z "$INPUT_SCRIPT" ] || [ -z "$OUTPUT_SCRIPT" ]; then
  echo "Usage: $0 <input_script> <output_script> [expected_tool] [target_url]"
  echo "Example: $0 scripts/gallery/javascript-selenium-fun.js scripts/tests/temp/test.js selenium http://localhost:3000"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_SCRIPT")"
cp "$INPUT_SCRIPT" "$OUTPUT_SCRIPT"

# Step 1: Replace production domain with test domain
COOKIE_DOMAIN=$(echo "$TARGET_URL" | sed 's|https\?://||' | sed 's|:.*||' | sed 's|/.*||')
awk "{gsub(/https:\/\/zattas\.me/, \"$TARGET_URL\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"
awk "{gsub(/zattas\.me/, \"$COOKIE_DOMAIN\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"

# Step 2: Switch to headless mode for CI
awk "{gsub(/headless[[:space:]]*=[[:space:]]*false/, \"headless=true\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"
awk "{gsub(/headless[[:space:]]*:[[:space:]]*false/, \"headless: true\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"
awk "{gsub(/headless[[:space:]]*=[[:space:]]*False/, \"headless=True\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"
awk "{gsub(/headless[[:space:]]*:[[:space:]]*False/, \"headless: True\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"
awk "{gsub(/setHeadless\(false\)/, \"setHeadless(true)\"); print}" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"

# Step 3: Replace "keep open" line with assertion from file
EXTENSION="${OUTPUT_SCRIPT##*.}"
SCRIPT_BASENAME=$(basename "$INPUT_SCRIPT" ".$EXTENSION")
SCRIPT_TOOL=$(echo "$SCRIPT_BASENAME" | sed 's/^[^-]*-\([^-]*\).*/\1/')
SCRIPT_LANGUAGE=$(echo "$SCRIPT_BASENAME" | sed 's/^\([^-]*\).*/\1/')

ASSERTION_FILE="$(dirname "$0")/assertions/${SCRIPT_LANGUAGE}-${SCRIPT_TOOL}.${EXTENSION}"

if [ ! -f "$ASSERTION_FILE" ]; then
  echo "Error: Assertion file not found: $ASSERTION_FILE"
  exit 1
fi

# Extract indent from the "keep open" line
INDENT=$(grep "[Kk]eep.*[Oo]pen" "$OUTPUT_SCRIPT" | sed 's/^\([[:space:]]*\).*/\1/')

# Create a temporary file with the assertion
TEMP_ASSERTION=$(mktemp)
cat "$ASSERTION_FILE" | sed "s/{{EXPECTED_TOOL}}/$EXPECTED_TOOL/g" | sed "s/^/$INDENT/" > "$TEMP_ASSERTION"

# Use awk to replace the keep open line with the assertion content
awk "
/[Kk]eep.*[Oo]pen/ {
  while ((getline line < \"$TEMP_ASSERTION\") > 0) {
    print line
  }
  close(\"$TEMP_ASSERTION\")
  next
}
{ print }
" "$OUTPUT_SCRIPT" > "${OUTPUT_SCRIPT}.tmp" && mv "${OUTPUT_SCRIPT}.tmp" "$OUTPUT_SCRIPT"

rm -f "$TEMP_ASSERTION"

echo "✓ Transformed $INPUT_SCRIPT → $OUTPUT_SCRIPT"
echo "  Expected tool: $EXPECTED_TOOL"
echo "  Target URL: $TARGET_URL"
