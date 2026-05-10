#!/bin/bash

set -e

source /tmp/prepare-env

cd "$TEMP_DIR"
# SE_CHROMEDRIVER is set by the selenium/standalone-chromium base image to the
# version-matched chromedriver. Pass it explicitly so Selenium Manager doesn't
# try to download one from the internet (fails in offline container).
mvn compile exec:java -Dexec.mainClass="$JAVA_CLASS" \
  -Dwebdriver.chrome.driver="${SE_CHROMEDRIVER}" \
  -q 2>&1
EXIT_CODE=$?

rm -rf "$TEMP_DIR" /tmp/prepare-env
exit $EXIT_CODE
