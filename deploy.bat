@echo off
REM CDPTA Platform Deployment Script for Windows
REM This script builds and prepares the application for deployment

echo.
echo ========================================
echo  CDPTA Platform Deployment Script
echo ========================================
echo.

REM Step 1: Clean previous build
echo [1/3] Cleaning previous build...
if exist dist rmdir /s /q dist

REM Step 2: Install dependencies (if needed)
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Step 3: Build the application
echo [3/3] Building application...
call npm run build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Build Successful!
    echo ========================================
    echo.
    echo Output directory: dist\
    echo.
    echo Next steps:
    echo 1. Upload the 'dist' folder to your hosting provider
    echo 2. Configure your web server for SPA routing
    echo 3. Set up environment variables (if needed)
    echo.
    echo For testing locally, run: npm run preview
    echo.
) else (
    echo.
    echo ========================================
    echo  Build Failed!
    echo ========================================
    echo.
    echo Please check the errors above.
    echo.
    exit /b 1
)

pause
