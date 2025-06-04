# PortfolioAI - Professional Portfolio Generator

PortfolioAI is an intelligent portfolio generator that helps you create a professional, interactive portfolio website in minutes. Simply input your information, and the application will generate a beautifully designed portfolio enhanced by AI.

![PortfolioAI Banner](https://lovable.dev/opengraph-image-p98pqg.png)

## Project Overview

PortfolioAI uses the power of Large Language Models (LLMs) through the Groq API to refine and enhance your bio and project descriptions, making them more professional and engaging. The application features a user-friendly interface, smooth animations, and responsive design to ensure your portfolio looks great on any device.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Features

- **AI-Enhanced Content**: Uses Groq API with Llama LLM to refine and improve your bio and project descriptions
- **Interactive UI**: Smooth scrolling, expandable sections, and mobile-responsive design
- **Professional Design**: Clean, modern design with customizable sections
- **Error Handling**: Comprehensive error handling for API calls and user inputs
- **Easy Editing**: Simple form interface to input and edit your information

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.0.0 or higher)
- npm (version 8.0.0 or higher)

You can check your versions with:
```sh
node --version
npm --version
```

If you need to install or update Node.js and npm, visit the [official Node.js website](https://nodejs.org/).

## Installation

### Quick Installation

We've provided installation scripts to make setup easier:

- **Windows users**: Double-click `install.bat`
- **macOS/Linux users**: Run `./install.sh` (you may need to make it executable first with `chmod +x install.sh`)

These scripts will check for Node.js and npm, install dependencies, and create your `.env` file.

### Manual Installation

If you prefer to install manually:

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   ```

2. Navigate to the project directory:
   ```sh
   cd PortfolioAI
   ```

3. Run the setup script:
   ```sh
   npm run setup
   ```

   This will install all dependencies and remind you to set up your environment variables.

4. Set up environment variables:
   - Copy `.env.example` to create a new `.env` file
   - Add your Groq API key to the `.env` file:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```

### Troubleshooting Installation

If you encounter issues during installation, try these commands:

- **Clean and reinstall dependencies**:
  ```sh
  npm run reinstall
  ```

- **If npm is not recognized**:
  See the detailed [INSTALLATION.md](./INSTALLATION.md) guide for step-by-step instructions on installing Node.js and npm.

## Setting up the Groq API

To use the AI enhancement features, you need a Groq API key:

1. Sign up for a Groq account at [console.groq.com](https://console.groq.com/)
2. Generate an API key in your Groq dashboard
3. Add the API key to your `.env` file as shown above

**Note**: The application will still work without a Groq API key, but the AI enhancement features will be disabled.

## Technologies Used

This project is built with:

- **Vite**: Fast, modern frontend build tool
- **React**: UI library for building component-based interfaces
- **TypeScript**: Typed JavaScript for better code quality
- **shadcn-ui**: High-quality UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Groq API**: API for accessing Llama LLM models
- **React Query**: Data fetching and state management
- **React Router**: Client-side routing

## Usage Guide

### Running the Application

Start the development server:
```sh
npm run dev
```

This will start the application at `http://localhost:8080` (or another port if 8080 is in use).

### Creating Your Portfolio

1. **Fill out the form**:
   - Enter your personal information, skills, and project details
   - Be as detailed as possible for better AI enhancement

2. **Generate your portfolio**:
   - Click "Generate My Portfolio" to create your portfolio
   - The application will process your information and enhance it using the Groq API
   - You'll see a loading screen while the processing takes place

3. **View and interact with your portfolio**:
   - Once generated, you can view your complete portfolio
   - Navigate through sections using the menu
   - Expand project cards to see full descriptions
   - Use the back-to-top button to quickly return to the top

4. **Edit your portfolio**:
   - Click "Edit" in the top navigation to return to the form
   - Your previous information will be preserved for editing

### Troubleshooting

If you encounter any issues:

- **API Key Issues**: Verify your Groq API key is correctly set in the `.env` file
- **npm not found**: Ensure Node.js and npm are properly installed and in your PATH
- **Loading errors**: Check your internet connection and Groq API status

## Deployment

### Deploy with Lovable

The easiest way to deploy this project is through Lovable:

1. Open [Lovable](https://lovable.dev/projects/5ce5031b-9469-4274-9655-97abf5b28b9c)
2. Click on Share -> Publish

### Custom Domain Setup

To connect a custom domain to your Lovable project:

1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the instructions to set up your domain

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq](https://groq.com/) for providing the LLM API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lovable](https://lovable.dev/) for the development platform
