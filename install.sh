#!/bin/bash

echo "==================================="
echo "PortfolioAI Installation Assistant"
echo "==================================="
echo

echo "Checking for Node.js installation..."
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed or not in your PATH."
  echo "Please install Node.js using your package manager or from https://nodejs.org/"
  echo "After installing Node.js, run this script again."
  exit 1
fi

echo "Node.js is installed. Version:"
node --version
echo

echo "Checking for npm installation..."
if ! command -v npm &> /dev/null; then
  echo "npm is not installed or not in your PATH."
  echo "Please reinstall Node.js and ensure npm is included."
  exit 1
fi

echo "npm is installed. Version:"
npm --version
echo

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "Error installing dependencies."
  echo "Please check the error messages above."
  exit 1
fi

echo
echo "Checking for .env file..."
if [ ! -f .env ]; then
  echo "Creating .env file from template..."
  cp .env.example .env
  echo
  echo "IMPORTANT: Please edit the .env file and add your Groq API key."
else
  echo ".env file already exists."
fi

echo
echo "==================================="
echo "Installation completed successfully!"
echo
echo "To start the application, run:"
echo "npm run dev"
echo "==================================="
echo

# Make the script executable
chmod +x install.sh
