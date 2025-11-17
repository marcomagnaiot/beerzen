@echo off
echo ========================================
echo Starting Beerzen Development Servers
echo ========================================
echo.
echo This will open 2 command windows:
echo   - Backend (port 3030)
echo   - Frontend (port 5173)
echo.
echo Press Ctrl+C in each window to stop
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Backend...
start "Beerzen Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Beerzen Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers starting!
echo ========================================
echo.
echo Backend will be on: http://localhost:3030
echo Frontend will be on: http://localhost:5173
echo.
echo Check the opened windows for status
echo.
pause
