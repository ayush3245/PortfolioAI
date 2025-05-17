
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-full bg-primary animate-pulse-subtle"></div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">PortfolioAI</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-md">
          Craft your professional story, instantly with AI-powered portfolios
        </p>
      </div>
    </header>
  );
};

export default Header;
