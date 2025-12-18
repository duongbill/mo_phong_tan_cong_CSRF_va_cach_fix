@echo off
echo ========================================
echo   STARTING ALL SERVERS FOR CSRF DEMO
echo ========================================
echo.

echo [1/3] Starting main backend server (port 3000)...
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Starting frontend dev server (port 5173)...
start "Frontend Dev" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting attacker server (port 8080)...
start "Attacker Server" cmd /k "node attacker-server.js"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   ALL SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo Attacker: http://localhost:8080
echo.
echo DEMO STEPS:
echo 1. Login at http://localhost:5173
echo 2. Open http://localhost:8080 to trigger attack
echo 3. Check profile to see bio changed
echo.
echo Press any key to close this window...
pause >nul
