
import React, { useState } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingState from '@/components/LoadingState';
import PortfolioOutput from '@/components/PortfolioOutput';
import { toast } from '@/components/ui/use-toast';

interface PortfolioData {
  name: string;
  headline: string;
  bio: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    skillsUsed: string[];
  }[];
  hobbies: string;
  email: string;
  linkedin: string;
  github: string;
}

const Index = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'portfolio'>('form');
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  
  const handleFormSubmit = (data: PortfolioData) => {
    setPortfolioData(data);
    setStep('loading');
    
    // Simulate AI processing time
    setTimeout(() => {
      setStep('portfolio');
      toast({
        title: "Portfolio Generated!",
        description: "Your professional portfolio has been created successfully.",
        duration: 5000,
      });
    }, 5000);
  };
  
  const handleReset = () => {
    setStep('form');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {step === 'form' && (
        <>
          <Header />
          <main className="w-full max-w-4xl mx-auto px-4 pb-16">
            <InputForm onSubmit={handleFormSubmit} />
          </main>
        </>
      )}
      
      {step === 'loading' && (
        <main className="min-h-screen flex items-center justify-center">
          <LoadingState />
        </main>
      )}
      
      {step === 'portfolio' && portfolioData && (
        <PortfolioOutput data={portfolioData} onReset={handleReset} />
      )}
    </div>
  );
};

export default Index;
