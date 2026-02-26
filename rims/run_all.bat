@echo off
TITLE RIMS Multi-Stack Runner

echo ========================================
echo   STORK: Starting All Services
echo ========================================

:: Start FastAPI Backend (Port 8000)
echo [1/3] Launching FastAPI Backend...
start "FastAPI Backend" cmd /k "cd backend-fastapi && venv\Scripts\python -m app.main"

:: Start Express Backend (Port 5000)
echo [2/3] Launching Express Backend...
start "Express Backend" cmd /k "cd backend-express && npm run dev"

:: Start React Frontend (Port 5173)
echo [3/3] Launching React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   All systems are initializing!
echo   Check the separate windows for logs.
echo ========================================
pause
