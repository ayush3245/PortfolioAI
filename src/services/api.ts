
import { toast } from "@/components/ui/use-toast";

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
 * Process portfolio data through Groq API directly
 * @param data Original portfolio data from user input
 * @returns Enhanced portfolio data with refined bio and project descriptions
 */
export const processPortfolioWithGroq = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Starting portfolio enhancement process");

    // Make a request to our server-side API endpoint
    console.log("Making request to server-side API endpoint");

    const response = await fetch("http://localhost:3000/api/enhance-portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bio: data.bio,
        projects: data.projects,
        hobbies: data.hobbies
      })
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      toast({
        title: "Processing Error",
        description: errorData.error || "Failed to enhance portfolio content",
        variant: "destructive",
      });
      return fallbackProcessing(data);
    }

    // Process the response
    const responseData = await response.json();
    console.log("Received response from API:", responseData);

    if (!responseData.success) {
      console.error("API reported failure:", responseData.error);
      toast({
        title: "Processing Error",
        description: responseData.error || "Failed to enhance portfolio content",
        variant: "destructive",
      });
      return fallbackProcessing(data);
    }

    // Create enhanced portfolio data
    const enhancedData: PortfolioData = {
      ...data,
      bio: responseData.data?.enhancedBio || data.bio,
      projects: responseData.data?.enhancedProjects || data.projects,
      hobbies: responseData.data?.enhancedHobbies || data.hobbies
    };

    // Log the enhanced data for debugging
    console.log("Enhanced data:", enhancedData);

    return enhancedData;
  } catch (error) {
    // Handle errors
    console.error("Error processing portfolio with API:", error);
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
  // Check if the API key is set in the environment variables
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  console.log("API Key check:", !!apiKey, "Key length:", apiKey ? apiKey.length : 0);
  return !!apiKey;
};
