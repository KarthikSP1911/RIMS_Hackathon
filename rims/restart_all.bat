@echo off
echo ====================================================
echo   UrbanVoice Sentinel - Quick Restart Script
echo ====================================================
echo.
echo Stopping any existing processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting FastAPI Backend (Port 8000)...
start "FastAPI Backend" cmd /k "cd backend-fastapi && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

echo Starting Express Backend (Port 5000)...
start "Express Backend" cmd /k "cd backend-express && node src/server.js"
timeout /t 2 /nobreak >nul

echo Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ====================================================
echo   All services started!
echo   - Frontend: http://localhost:5173
echo   - FastAPI: http://localhost:8000
echo   - Express: http://localhost:5000
echo ====================================================
echo.
pause
