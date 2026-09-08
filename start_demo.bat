@echo off
title BORDER AI - Command Center Launcher (SIH26187)
color 0B
cls
echo ======================================================================
echo    BORDER AI - Intelligent Border Surveillance Platform
echo    SIH26187 - AI Video Analytics for Existing CCTV Infrastructure
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python backend dependencies...
python -c "import fastapi, uvicorn, sqlalchemy, pydantic" 2>nul
if %errorlevel% neq 0 (
    echo Installing backend dependencies from requirements.txt...
    python -m pip install -r backend\requirements.txt
)

echo.
echo [2/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "BORDER AI - Backend API" cmd /k "cd /d "%~dp0\backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Vite Frontend on http://127.0.0.1:5173 ...
start "BORDER AI - Frontend Console" cmd /k "cd /d "%~dp0\frontend" && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 4 /nobreak >nul

echo.
echo Launching Defense Operations Console in default browser...
start http://127.0.0.1:5173

echo.
echo ======================================================================
echo    SYSTEM ONLINE!
echo    Frontend: http://127.0.0.1:5173
echo    Backend:  http://127.0.0.1:8000  (API Docs: http://127.0.0.1:8000/docs)
echo ======================================================================
pause
