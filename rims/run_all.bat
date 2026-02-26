@echo off
TITLE UrbanVoice Sentinel - Multi-Stack Runner

echo ====================================================
echo   🏙️  UrbanVoice Sentinel: Launching Ecosystem
echo ====================================================

:: 1. Start FastAPI Core (Python)
echo [1/3] Starting FastAPI on Port 8000...
start "Sentinel-Core (FastAPI)" cmd /c "cd /d %~dp0backend-fastapi && .\venv\Scripts\python -m app.main"

:: 2. Start Express Middleware (Node)
echo [2/3] Starting Express on Port 5000...
start "Sentinel-Relay (Express)" cmd /c "cd /d %~dp0backend-express && npm.cmd run dev"

:: 3. Start React Frontend (Vite)
echo [3/3] Starting React UI on Port 5173...
start "Sentinel-UI (React)" cmd /c "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ====================================================
echo   🚀 All systems are launching in separate windows!
echo   - UI: http://localhost:5173
echo   - Express: http://localhost:5000
echo   - FastAPI: http://localhost:8000
echo ====================================================
timeout /t 5
