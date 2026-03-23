@echo off
title GSO CLASP Command Runner

:: Set colors for better visibility
color 0A

:: Clear screen
cls

echo ================================================================
echo                GSO Procurement System - CLASP Runner
echo ================================================================
echo.
echo This batch file provides easy access to clasp commands
echo for the GSO Procurement & Delivery System
echo.
echo Repository: https://github.com/251805/projgso.git
echo.

:: Check if we're in the right directory
if not exist ".clasp.json" (
    echo WARNING: .clasp.json not found!
    echo Please make sure you're in the projgso directory.
    echo.
    echo Current directory: %CD%
    echo.
    pause
    exit /b 1
)

:: Check if clasp is installed
where clasp >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: clasp is not installed!
    echo.
    echo To install clasp, run:
    echo   npm install -g @google/clasp
    echo.
    echo After installation, please log in:
    echo   clasp login
    echo.
    pause
    exit /b 1
)

echo clasp is installed and project is configured.
echo.

:: Quick menu
echo QUICK COMMANDS:
echo   1) clasp push           - Push changes to Google Apps Script
echo   2) clasp pull           - Pull changes from Google Apps Script  
echo   3) clasp open-script    - Open Apps Script IDE
echo   4) clasp open-web-app   - Open web app for testing
echo   5) clasp status         - Check sync status
echo   6) clasp logs           - View execution logs
echo   7) Custom command       - Enter your own clasp command
echo   8) Exit
echo.

set /p choice="Select option (1-8): "

if "%choice%"=="1" (
    echo.
    echo Pushing changes to Google Apps Script...
    clasp push
)

if "%choice%"=="2" (
    echo.
    echo Pulling changes from Google Apps Script...
    clasp pull
)

if "%choice%"=="3" (
    echo.
    echo Opening Apps Script IDE in browser...
    clasp open-script
)

if "%choice%"=="4" (
    echo.
    echo Opening web app in browser...
    clasp open-web-app
)

if "%choice%"=="5" (
    echo.
    echo Checking sync status...
    clasp status
)

if "%choice%"=="6" (
    echo.
    echo Showing execution logs...
    clasp logs
)

if "%choice%"=="7" (
    echo.
    set /p custom="Enter custom clasp command: "
    if not "%custom%"=="" (
        echo Executing: clasp %custom%
        clasp %custom%
    ) else (
        echo No command entered.
    )
)

if "%choice%"=="8" (
    echo Exiting...
    exit /b 0
)

if "%choice%"=="" (
    echo No valid option selected.
)

echo.
echo ================================================================
echo Operation completed!
echo Press any key to return to menu or close window...
pause >nul
call "%~f0"
