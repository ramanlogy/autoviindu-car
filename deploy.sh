#!/usr/bin/env bash
# Server-side deploy for the cPanel Node.js app.
#
# Run this from the app root (~/repositories/autoviindu-car) with the
# Node.js application STOPPED in cPanel, so nothing is respawning while
# node_modules is rebuilt.
#
#   cd ~/repositories/autoviindu-car
#   bash deploy.sh
#
# After it finishes cleanly, Start the app from cPanel > Setup Node.js App
# and watch Resource Usage for a few minutes.

set -euo pipefail
cd "$(dirname "$0")"

echo "== 1/3  git pull =="
git fetch origin main
git reset --hard origin/main

echo "== 2/3  clean dependency install =="
rm -rf node_modules
npm ci --omit=dev --no-audit --no-fund

echo "== 3/3  prisma generate =="
npx prisma generate

echo
echo "Deploy prepared. Now Start the Node.js app in cPanel and watch Resource Usage."
