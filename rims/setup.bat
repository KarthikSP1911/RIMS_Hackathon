@echo off
TITLE UrbanVoice Sentinel - First Time Setup

echo ====================================================
echo   🏙️  UrbanVoice Sentinel: Automatic Setup
echo ====================================================
echo.

:: 1. Root Installation
echo [1/4] Installing Root Dependencies...
call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing root dependencies.
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Frontend Installation
echo [2/4] Installing Frontend Dependencies (React)...
cd frontend
call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies.
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..

:: 3. Express Backend Installation
echo [3/4] Installing Express Middleware Dependencies...
cd backend-express
call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing express dependencies.
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..

:: 4. FastAPI Backend Setup
echo [4/4] Setting up FastAPI (Python Virtual Environment)...
cd backend-fastapi
if not exist venv (
    python -m venv venv
)
call .\venv\Scripts\pip install fastapi uvicorn requests pydantic-settings
if %ERRORLEVEL% NEQ 0 (
    echo Error setting up FastAPI dependencies.
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ====================================================
echo   ✅ Setup Complete! 
echo   You can now run the app using: run_all.bat
echo ====================================================
echo.
pause
