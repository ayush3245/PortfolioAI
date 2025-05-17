
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import LoadingState from '@/components/LoadingState';
import PortfolioOutput from '@/components/PortfolioOutput';
import { toast } from '@/components/ui/use-toast';
import { PortfolioData, processPortfolioWithGroq, isApiKeySet } from '@/services/api';
import { handleApiError } from '@/lib/error-utils';
import {
  savePortfolioData,
  loadPortfolioData,
  saveCurrentStep,
  loadCurrentStep
} from '@/lib/storage-utils';

const Index = () => {
  // Initialize state with values from localStorage if available
  const [step, setStep] = useState<'form' | 'loading' | 'portfolio'>(loadCurrentStep());
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(loadPortfolioData());
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom setter for step that also saves to localStorage
  const setStepWithStorage = (newStep: 'form' | 'loading' | 'portfolio') => {
    setStep(newStep);
    saveCurrentStep(newStep);
  };

  // Custom setter for portfolioData that also saves to localStorage
  const setPortfolioDataWithStorage = (data: PortfolioData | null) => {
    setPortfolioData(data);
    savePortfolioData(data);
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = loadPortfolioData();
    const savedStep = loadCurrentStep();

    // Don't restore to loading state on page refresh
    if (savedStep === 'loading') {
      setStep('form');
      saveCurrentStep('form');
    } else {
      setStep(savedStep);
    }

    if (savedData) {
      setPortfolioData(savedData);
    }

    // Check if API key is set and show a warning if not
    if (!isApiKeySet()) {
      toast({
        title: "API Key Missing",
        description: "Groq API key is not set. AI enhancement features will be disabled.",
        variant: "destructive",
        duration: 10000,
      });
    }
  }, []);

  const handleFormSubmit = async (data: PortfolioData) => {
    // Save the original data immediately
    setPortfolioDataWithStorage(data);
    setStepWithStorage('loading');
    setError(null);
    setIsProcessing(true);

    try {
      // Check if API key is set
      if (!isApiKeySet()) {
        console.warn("API key not set, skipping enhancement");
        toast({
          title: "API Key Missing",
          description: "Groq API key is not set. Your portfolio will be created without AI enhancements.",
          duration: 5000,
        });

        // Just use the original data
        setStepWithStorage('portfolio');

        // Short delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
      }

      // Process the portfolio data with Groq API
      console.log("Sending data to Groq API:", data);
      const enhancedData = await processPortfolioWithGroq(data);
      console.log("Received enhanced data:", enhancedData);

      // Check if the API actually enhanced the content
      const bioChanged = enhancedData.bio !== data.bio;
      const projectsChanged = JSON.stringify(enhancedData.projects) !== JSON.stringify(data.projects);
      const hobbiesChanged = enhancedData.hobbies !== data.hobbies;

      console.log("Bio changed:", bioChanged);
      console.log("Projects changed:", projectsChanged);
      console.log("Hobbies changed:", hobbiesChanged);

      // Update the portfolio data with enhanced content
      setPortfolioDataWithStorage(enhancedData);
      setStepWithStorage('portfolio');

      // Show appropriate toast message based on whether content was enhanced
      if (bioChanged || projectsChanged || hobbiesChanged) {
        toast({
          title: "Portfolio Generated!",
          description: "Your professional portfolio has been created and enhanced with AI.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Portfolio Generated!",
          description: "Your portfolio has been created, but no AI enhancements were applied.",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Error in handleFormSubmit:", err);
      handleApiError(err, "Failed to generate portfolio");
      setError("An error occurred while processing your portfolio. Please try again.");
      // Fall back to original data but still show the portfolio
      setStepWithStorage('portfolio');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStepWithStorage('form');
    // We no longer reset portfolioData here, to preserve it for editing
  };

  return (
    <div className="min-h-screen bg-background">
      {step === 'form' && (
        <div className="flex flex-col">
          <Header />
          <main className="w-full max-w-4xl mx-auto px-4 pb-16 animate-fade-in">
            <InputForm onSubmit={handleFormSubmit} initialData={portfolioData} />
          </main>
        </div>
      )}

      {step === 'loading' && (
        <main className="min-h-screen flex items-center justify-center">
          <LoadingState
            error={error}
            onRetry={() => {
              if (portfolioData) {
                handleFormSubmit(portfolioData);
              } else {
                setStepWithStorage('form');
              }
            }}
          />
        </main>
      )}

      {step === 'portfolio' && portfolioData && (
        <PortfolioOutput
          data={portfolioData}
          onReset={handleReset}
          originalData={loadPortfolioData()}
        />
      )}
    </div>
  );
};

export default Index;
