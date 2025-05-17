
import React from 'react';
import { motion } from "framer-motion";
import { Lightbulb, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/20">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-primary/30 blur-sm"></div>
            <div className="relative h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            PortfolioAI
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-xl sm:text-2xl mb-6 text-muted-foreground text-center">
            Craft your professional story, instantly with AI-powered portfolios
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm">Professional Design</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm">Instant Results</span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
