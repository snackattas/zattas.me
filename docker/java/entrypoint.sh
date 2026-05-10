#!/bin/bash

set -e

echo "===== PREPARE ====="
/app/docker/java/prepare.sh

echo ""
echo "===== RUN ====="
/app/docker/java/run.sh
