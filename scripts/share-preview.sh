#!/usr/bin/env bash
# Starts the site + a public Cloudflare tunnel so the team can review it
# while DNS propagates. Keep this terminal window open. Ctrl+C stops both.
set -e
cd "$(dirname "$0")/.."

echo "Starting server on http://localhost:3000 ..."
npm start &
SERVER_PID=$!

# stop the server too when this script is killed
trap 'kill $SERVER_PID 2>/dev/null' EXIT

sleep 3
echo "Opening public tunnel (URL appears below in a few seconds) ..."
~/bin/cloudflared tunnel --url http://localhost:3000 --no-autoupdate
