#!/bin/sh
# DevQuest launcher for Mac and Linux: in a terminal, run `sh start-mac-linux.sh` in the DevQuest folder.
# It starts DevQuest and opens it in your browser. The first time it installs what DevQuest needs (npm install).
# Press Ctrl + C in the terminal to stop DevQuest.
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed."
  echo "Download the LTS version from https://nodejs.org, install it, then run this again."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing what DevQuest needs. This takes a minute, and only happens the first time..."
  if ! npm install; then
    echo "The installation failed. Check your internet connection and try again."
    exit 1
  fi
fi

echo "Starting DevQuest. It opens in your browser in a few seconds."
echo "Keep this terminal open while you use DevQuest; press Ctrl + C to stop it."
# Opens the browser after 5 seconds (open on a Mac, xdg-open on Linux), while DevQuest starts here
URL=http://localhost:5173
(
  sleep 5
  if [ "$(uname)" = "Darwin" ]; then open "$URL"; elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"; fi
) >/dev/null 2>&1 &
npm run dev
