@echo off
echo ===================================
echo PortfolioAI Installation Assistant
echo ===================================
echo.

echo Checking for Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo Make sure to check "Add to PATH" during installation.
  echo After installing Node.js, run this script again.
  pause
  exit /b 1
)

echo Node.js is installed. Version:
node --version
echo.

echo Checking for npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo npm is not installed or not in your PATH.
  echo Please reinstall Node.js and ensure npm is included.
  pause
  exit /b 1
)

echo npm is installed. Version:
npm --version
echo.

echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Error installing dependencies.
  echo Please check the error messages above.
  pause
  exit /b 1
)

echo.
echo Checking for .env file...
if not exist .env (
  echo Creating .env file from template...
  copy .env.example .env
  echo.
  echo IMPORTANT: Please edit the .env file and add your Groq API key.
) else (
  echo .env file already exists.
)

echo.
echo ===================================
echo Installation completed successfully!
echo.
echo To start the application, run:
echo npm run dev
echo ===================================
echo.

pause
