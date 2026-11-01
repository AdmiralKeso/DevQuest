@echo off
rem DevQuest launcher for Windows: double-click this file to start DevQuest and open it in your browser.
rem The first time it installs what DevQuest needs (npm install). Close this window to stop DevQuest.
cd /d "%~dp0"
title DevQuest

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Download the LTS version from https://nodejs.org, install it, then double-click this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing what DevQuest needs. This takes a minute, and only happens the first time...
  call npm install
  if errorlevel 1 (
    echo The installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo Starting DevQuest. It opens in your browser in a few seconds.
echo Keep this window open while you use DevQuest; close it to stop DevQuest.
rem Opens the browser after 5 seconds, while DevQuest starts in this window
start "" /b cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:5173"
call npm run dev
pause
