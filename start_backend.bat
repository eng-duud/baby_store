@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting Baby Store Backend Setup...
echo ========================================================
cd backend
echo Installing dependencies...
call npm install
echo.
echo Setting up SQLite database...
call npm run db:generate
call npm run db:push
echo.
echo Starting the Express server...
call npm run dev
pause
