#!/bin/bash
# Transform gallery scripts for testing:
# 1. Replace https://zattas.me with localhost
# 2. Replace "keep open" line with cookie detection assertion from assertion files
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
sed -i '' "s|https://zattas.me|$TARGET_URL|g" "$OUTPUT_SCRIPT"
sed -i '' "s|zattas\.me|localhost|g" "$OUTPUT_SCRIPT"

# Step 2: Replace "keep open" line with assertion from file
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

# Read assertion file, substitute {{EXPECTED_TOOL}}, and add indent to each line
ASSERTION=$(cat "$ASSERTION_FILE" | sed "s/{{EXPECTED_TOOL}}/$EXPECTED_TOOL/g" | sed "s/^/$INDENT/")

# Replace "keep open" line with indented assertion (using a temporary placeholder)
sed -i '' "/[Kk]eep.*[Oo]pen/c\\
${ASSERTION}
" "$OUTPUT_SCRIPT"

echo "✓ Transformed $INPUT_SCRIPT → $OUTPUT_SCRIPT"
echo "  Expected tool: $EXPECTED_TOOL"
echo "  Target URL: $TARGET_URL"
