@echo off
echo ========================================
echo FIXING AUTO-REFRESH ISSUE
echo ========================================
echo.

echo Step 1: Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleared!

echo Step 3: Clearing node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Node cache cleared!

echo Step 4: Starting dev server with webpack (stable)...
echo.
echo ========================================
echo SERVER STARTING - Please wait...
echo ========================================
echo.

npm run dev
