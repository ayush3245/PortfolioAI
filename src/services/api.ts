
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

/**
 * Process portfolio data through Supabase Edge Function
 * @param data Original portfolio data from user input
 * @returns Enhanced portfolio data with refined bio and project descriptions
 */
export const processPortfolioWithGroq = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Starting portfolio enhancement process with Supabase Edge Function");

    // Call the Supabase Edge Function
    const { data: response, error } = await supabase.functions.invoke('enhance-portfolio', {
      body: {
        bio: data.bio,
        projects: data.projects,
        hobbies: data.hobbies
      }
    });

    // Handle errors from the Edge Function
    if (error) {
      console.error("Supabase Edge Function error:", error);
      toast({
        title: "Processing Error",
        description: error.message || "Failed to enhance portfolio content",
        variant: "destructive",
      });
      return fallbackProcessing(data);
    }

    // Process the response
    console.log("Received response from Supabase Edge Function:", response);

    if (!response?.success) {
      console.error("Edge Function reported failure:", response?.error);
      toast({
        title: "Processing Error",
        description: response?.error || "Failed to enhance portfolio content",
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
    console.log("Enhanced data:", enhancedData);

    toast({
      title: "Portfolio Enhanced!",
      description: "Your portfolio content has been improved using AI.",
      duration: 5000,
    });

    return enhancedData;
  } catch (error) {
    // Handle errors
    console.error("Error processing portfolio with Supabase Edge Function:", error);
    toast({
      title: "Processing Error",
      description: error instanceof Error ? error.message : "Failed to enhance portfolio content",
      variant: "destructive",
    });

    // Return original data if there's an error
    return fallbackProcessing(data);
  }
};

/**
 * Fallback processing when Edge Function is not available
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
 * Debug function to check if the Supabase connection is working
 * @returns True if connected, false otherwise
 */
export const isSupabaseConnected = (): boolean => {
  try {
    // Check if supabase client is properly initialized
    const isConnected = !!supabase && !!supabase.supabaseUrl;
    console.log("Supabase connection check:", isConnected);
    return isConnected;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
};
