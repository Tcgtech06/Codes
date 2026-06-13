# PowerShell script to create notifications table in Supabase
# Run this from the project root directory

Write-Host "Creating notifications table in Supabase..." -ForegroundColor Cyan

# Read the SQL file
$sqlFile = "database/migrations/01_create_notifications_simple.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "Error: SQL file not found at $sqlFile" -ForegroundColor Red
    exit 1
}

$sql = Get-Content $sqlFile -Raw

Write-Host "`nSQL to execute:" -ForegroundColor Yellow
Write-Host $sql -ForegroundColor Gray

Write-Host "`n`nPlease follow these steps:" -ForegroundColor Green
Write-Host "1. Go to your Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project: knitinfo-backend" -ForegroundColor White
Write-Host "3. Click on 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "4. Click 'New Query'" -ForegroundColor White
Write-Host "5. Copy the SQL above and paste it into the editor" -ForegroundColor White
Write-Host "6. Click 'Run' or press Ctrl+Enter" -ForegroundColor White

Write-Host "`n`nAlternatively, copy this SQL to clipboard:" -ForegroundColor Cyan
Set-Clipboard -Value $sql
Write-Host "SQL copied to clipboard! Just paste it in Supabase SQL Editor." -ForegroundColor Green

# Keep window open
Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
