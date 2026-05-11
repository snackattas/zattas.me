#!/bin/bash

set -e

source /tmp/prepare-env

cd "$TEMP_DIR"
# Selenium Manager tries to download chromedriver from the internet, which fails
# in this offline container. Use the system chromedriver from the base image instead.
mvn compile exec:java -Dexec.mainClass="$JAVA_CLASS" \
  -Dwebdriver.chrome.driver="$(which chromedriver)" \
  -q 2>&1
EXIT_CODE=$?

rm -rf "$TEMP_DIR" /tmp/prepare-env
exit $EXIT_CODE
