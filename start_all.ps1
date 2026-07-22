$erpPath = $PSScriptRoot

Write-Host "Starting University ERP Backend (Neon DB)..."
Start-Process powershell -WorkingDirectory "$erpPath\backend" -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Starting University ERP Frontend..."
Start-Process powershell -WorkingDirectory "$erpPath\frontend" -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "All services started in separate windows!"
