@echo off
echo ========================================
echo     GSO Procurement System - CLASP
echo ========================================
echo.

:: Check if clasp is installed
where clasp >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: clasp is not installed!
    echo Please install clasp by running: npm install -g @google/clasp
    echo.
    pause
    exit /b 1
)

:: Display current directory
echo Current Directory: %CD%
echo.

:: Show available commands
echo Available Commands:
echo   clasp push          - Push local files to Google Apps Script
echo   clasp pull          - Pull files from Google Apps Script
echo   clasp open-script   - Open Apps Script IDE in browser
echo   clasp open-web-app  - Open web app in browser
echo   clasp status        - Show sync status
echo   clasp logs          - Show execution logs
echo   clasp deploy        - Deploy new version
echo.

:: Get user input
set /p command="Enter clasp command (or 'help' for more options): "

if "%command%"=="help" (
    echo.
    echo Full clasp help:
    clasp --help
    echo.
    pause
    exit /b 0
)

if "%command%"=="" (
    echo No command entered. Exiting...
    pause
    exit /b 0
)

:: Execute the command
echo.
echo Executing: clasp %command%
echo ========================================
clasp %command%

echo.
echo ========================================
echo Command completed!
pause
