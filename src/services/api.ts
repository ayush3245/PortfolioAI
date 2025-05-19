
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the interface for portfolio data
export interface PortfolioData {
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

// Define the interface for API response
interface ApiResponse {
  success: boolean;
  data?: {
    enhancedBio?: string;
    enhancedProjects?: {
      title: string;
      description: string;
      skillsUsed: string[];
    }[];
    enhancedHobbies?: string;
  };
  error?: string;
}

/**
 * Process portfolio data through Groq API via Supabase Edge Function
 * @param data Original portfolio data from user input
 * @returns Enhanced portfolio data with refined bio and project descriptions
 */
export const processPortfolioWithGroq = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Starting portfolio enhancement process");
    
    // Call the Supabase Edge Function
    console.log("Calling Supabase Edge Function to process portfolio");
    
    const { data: responseData, error } = await supabase.functions.invoke("enhance-portfolio", {
      body: {
        bio: data.bio,
        projects: data.projects,
        hobbies: data.hobbies
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      toast({
        title: "Processing Error",
        description: error.message || "Failed to enhance portfolio content",
        variant: "destructive",
      });
      return fallbackProcessing(data);
    }

    // Process the response from the edge function
    const response = responseData as ApiResponse;
    
    if (!response.success) {
      console.error("Edge function reported failure:", response.error);
      toast({
        title: "Processing Error",
        description: response.error || "Failed to enhance portfolio content",
        variant: "destructive",
      });
      return fallbackProcessing(data);
    }

    // Create enhanced portfolio data
    const enhancedData: PortfolioData = {
      ...data,
      bio: response.data?.enhancedBio || data.bio,
      projects: response.data?.enhancedProjects || data.projects,
      hobbies: response.data?.enhancedHobbies || data.hobbies
    };

    // Log the enhanced data for debugging
    console.log("Enhanced data received from edge function:", enhancedData);

    return enhancedData;
  } catch (error) {
    // Handle errors
    console.error("Error processing portfolio with Edge Function:", error);
    toast({
      title: "Processing Error",
      description: error instanceof Error ? error.message : "Failed to enhance portfolio content",
      variant: "destructive",
    });

    // Return original data if there's an error
    return data;
  }
};

/**
 * Fallback processing when API is not available
 * @param data Original portfolio data
 * @returns Same data with minimal enhancements
 */
const fallbackProcessing = (data: PortfolioData): PortfolioData => {
  console.log("Using fallback processing");
  // Simple fallback processing without API
  return {
    ...data,
    bio: data.bio.trim(),
    projects: data.projects.map(project => ({
      ...project,
      description: project.description.trim()
    })),
    hobbies: data.hobbies.trim()
  };
};

/**
 * Debug function to check if the API key is set
 * @returns True if the API key is set, false otherwise
 */
export const isApiKeySet = (): boolean => {
  // This check is only used for UI messaging
  // The actual API key used is from the Supabase Edge Function's environment
  return true;
};
