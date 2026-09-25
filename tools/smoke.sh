#!/usr/bin/env bash
# Math Quest verification harness. Run from repo root or anywhere.
set -uo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR/.."

FAIL=0

echo "== 1. Syntax check of embedded <script> blocks =="
node "$DIR/extract-check.js" || FAIL=1

echo ""
echo "== 2. Headless Chromium load + console error check + screenshots =="
if [ -d "$DIR/node_modules/puppeteer" ]; then
  node "$DIR/headless-check.js" || FAIL=1
else
  echo "SKIP: puppeteer not installed in tools/node_modules; run 'npm install puppeteer --prefix tools'"
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "SMOKE TEST: PASS"
else
  echo "SMOKE TEST: FAIL"
fi
exit $FAIL
