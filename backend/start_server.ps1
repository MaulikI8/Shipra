# PowerShell script to start Django server
Write-Host "Activating virtual environment..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

Write-Host "Starting Django server..." -ForegroundColor Green
python manage.py runserver

