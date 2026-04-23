@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting Baby Store Frontend Setup...
echo ========================================================
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting Vite server...
call npm run dev
pause
