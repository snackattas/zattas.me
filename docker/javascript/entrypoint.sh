#!/bin/bash

set -e

echo "===== PREPARE ====="
/app/docker/javascript/prepare.sh

echo ""
echo "===== RUN ====="
/app/docker/javascript/run.sh
