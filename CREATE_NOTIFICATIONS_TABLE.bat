@echo off
echo ========================================
echo Creating Notifications Table in Supabase
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -File "scripts/create-notifications-table.ps1"

pause
