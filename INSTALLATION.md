# Detailed Installation Guide for PortfolioAI

This guide provides detailed instructions for installing and setting up PortfolioAI, including troubleshooting common issues.

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Disk Space**: At least 500MB of free disk space
- **Memory**: At least 2GB of RAM

## Installing Node.js and npm

### Windows

1. **Download the installer**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS (Long Term Support) version

2. **Run the installer**:
   - Double-click the downloaded file
   - Follow the installation wizard
   - **Important**: Make sure to check the option to "Add to PATH"

3. **Verify installation**:
   - Open Command Prompt or PowerShell
   - Run the following commands:
     ```
     node --version
     npm --version
     ```

4. **Troubleshooting**:
   - If `node` or `npm` is not recognized, try restarting your computer
   - If still not working, you may need to manually add Node.js to your PATH:
     1. Search for "Environment Variables" in Windows search
     2. Click "Edit the system environment variables"
     3. Click "Environment Variables"
     4. Under "System variables", find "Path" and click "Edit"
     5. Add the path to your Node.js installation (typically `C:\Program Files\nodejs\`)
     6. Click "OK" on all dialogs

### macOS

1. **Using Homebrew (recommended)**:
   ```
   brew install node
   ```

2. **Using the installer**:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the macOS installer
   - Run the installer package

3. **Verify installation**:
   ```
   node --version
   npm --version
   ```

### Linux

1. **Using package manager**:
   
   For Ubuntu/Debian:
   ```
   sudo apt update
   sudo apt install nodejs npm
   ```
   
   For Fedora:
   ```
   sudo dnf install nodejs
   ```

2. **Using NVM (Node Version Manager)**:
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```

3. **Verify installation**:
   ```
   node --version
   npm --version
   ```

## Setting Up the Project

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd PortfolioAI
   ```

2. **Install dependencies**:
   ```
   npm install
   ```
   
   If you encounter permission errors:
   - On Windows: Run Command Prompt or PowerShell as Administrator
   - On macOS/Linux: Use `sudo npm install` or fix npm permissions

3. **Set up environment variables**:
   ```
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server**:
   ```
   npm run dev
   ```
   
   The application should now be running at http://localhost:8080

## Troubleshooting Common Issues

### "npm not recognized" Error

This error occurs when npm is not in your system's PATH.

**Solution**:
1. Make sure Node.js is installed correctly
2. Try using the full path to npm:
   - Windows: `C:\Program Files\nodejs\npm.cmd`
   - macOS/Linux: `/usr/local/bin/npm` or `/usr/bin/npm`
3. Reinstall Node.js and ensure "Add to PATH" is selected

### Installation Fails with Permission Errors

**Solution**:
1. On Windows: Run Command Prompt as Administrator
2. On macOS/Linux: Use `sudo` or fix npm permissions:
   ```
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   ```
   
   Add to your .bashrc or .zshrc:
   ```
   export PATH=~/.npm-global/bin:$PATH
   ```

### "Module not found" Errors

**Solution**:
1. Make sure all dependencies are installed:
   ```
   npm install
   ```
2. Clear npm cache:
   ```
   npm cache clean --force
   ```
3. Delete node_modules folder and reinstall:
   ```
   rm -rf node_modules
   npm install
   ```

### Groq API Issues

**Solution**:
1. Verify your API key is correct
2. Check if the Groq service is operational
3. Ensure your `.env` file is in the correct location (project root)
4. Restart the development server after making changes to `.env`

## Getting Help

If you continue to experience issues:
- Check the [GitHub Issues](https://github.com/yourusername/PortfolioAI/issues) for similar problems
- Create a new issue with details about your problem
- Reach out to the community for support
