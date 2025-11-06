#!/usr/bin/env pwsh
# Server startup script for Jirani Mwema Backend

Set-Location "c:\Users\User\Desktop\Chama\jirani_mwema_backend\functions"

Write-Host "Starting Jirani Mwema Backend Server..." -ForegroundColor Green
Write-Host "Directory: $(Get-Location)" -ForegroundColor Cyan

node src/app.js
