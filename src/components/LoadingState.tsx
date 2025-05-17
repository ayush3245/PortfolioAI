
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LoadingStateProps {
  error?: string | null;
  onRetry?: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ error, onRetry }) => {
  const [loadingText, setLoadingText] = React.useState('Analyzing your inputs...');

  React.useEffect(() => {
    const messages = [
      'Analyzing your inputs...',
      'Consulting the AI muses...',
      'Polishing your story...',
      'Building your digital stage...',
      'Crafting your professional narrative...',
      'Arranging your showcase...',
      'Adding the final touches...'
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingText(messages[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // If there's an error, show error state
  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center animate-fade-in">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Normal loading state
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent/50 animate-spin-slow"></div>
        <div className="absolute inset-2 rounded-full bg-background"></div>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent/50 rounded-full animate-pulse-subtle"></div>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <h3 className="text-xl font-semibold animate-pulse-subtle">{loadingText}</h3>
        <p className="text-muted-foreground">Please wait while we create your professional portfolio</p>
      </div>

      <div className="mt-12 relative">
        <div className="h-1.5 w-60 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-gradient-shift bg-gradient-to-r from-primary to-primary/50 to-accent/70"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
