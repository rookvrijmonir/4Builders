#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://127.0.0.1:8000/schilderwerk/offerte/}"
OUT_DIR="${2:-/tmp}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_FILE="${OUT_DIR}/lighthouse-mobile-${STAMP}.json"

DEFAULT_CHROME_PATH="${HOME}/.local/playwright-browsers/chromium-1148/chrome-linux/chrome"
CHROME_BIN="${CHROME_PATH:-$DEFAULT_CHROME_PATH}"
LIGHTHOUSE_BIN="${LIGHTHOUSE_BIN:-$HOME/.npm-global/bin/lighthouse}"

if [[ ! -x "$CHROME_BIN" ]]; then
  echo "ERROR: Chrome binary not found or not executable: $CHROME_BIN"
  exit 1
fi

if [[ ! -x "$LIGHTHOUSE_BIN" ]]; then
  echo "ERROR: Lighthouse binary not found: $LIGHTHOUSE_BIN"
  exit 1
fi

echo "Running Lighthouse mobile audit..."
echo "URL: $URL"
echo "Chrome: $CHROME_BIN"
echo "Output: $OUT_FILE"

CHROME_PATH="$CHROME_BIN" "$LIGHTHOUSE_BIN" "$URL" \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile \
  --chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --no-proxy-server" \
  --output=json \
  --output-path="$OUT_FILE"

node <<'NODE' "$OUT_FILE"
const fs = require('fs');
const file = process.argv[1];
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const score = (k) => Math.round((report.categories[k]?.score || 0) * 100);
const metric = (k) => report.audits[k]?.displayValue || report.audits[k]?.numericValue || '-';
console.log('--- Lighthouse Mobile Summary ---');
console.log(`performance: ${score('performance')}`);
console.log(`accessibility: ${score('accessibility')}`);
console.log(`best-practices: ${score('best-practices')}`);
console.log(`seo: ${score('seo')}`);
console.log(`FCP: ${metric('first-contentful-paint')}`);
console.log(`LCP: ${metric('largest-contentful-paint')}`);
console.log(`TTI: ${metric('interactive')}`);
console.log(`TBT: ${metric('total-blocking-time')}`);
console.log(`CLS: ${metric('cumulative-layout-shift')}`);
NODE

echo "Report written to: $OUT_FILE"
