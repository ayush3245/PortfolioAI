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
  };
  error?: string;
}

/**
 * Process portfolio data through Groq API
 * @param data Original portfolio data from user input
 * @returns Enhanced portfolio data with refined bio and project descriptions
 */
export const processPortfolioWithGroq = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    // Check if GROQ_API_KEY is available
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.warn("Groq API key not found. Using fallback processing.");
      return fallbackProcessing(data);
    }

    // Prepare the request payload
    const payload = {
      model: "llama3-8b-8192", // Using Llama 3 model
      messages: [
        {
          role: "system",
          content: `You are a professional portfolio assistant. Your task is to enhance the user's bio, project descriptions, and hobbies to make them more professional, engaging, and impactful.

PORTFOLIO BEST PRACTICES:
1. Focus on demonstrating skills through concrete examples, not just listing them
2. Include specific metrics and outcomes for projects when possible
3. Highlight problem-solving processes and technical challenges overcome
4. Ensure content is concise, well-structured, and free of grammar errors
5. For hobbies, show personality while maintaining professionalism

IMPORTANT: You MUST respond with valid JSON in the following format:
{
  "bio": "enhanced bio text here",
  "projects": [
    {
      "title": "project title (keep original)",
      "description": "enhanced project description that follows best practices",
      "skillsUsed": ["skill1", "skill2", "..."] (keep original skills)
    },
    ...more projects
  ],
  "hobbies": "enhanced hobbies text, formatted as a comma-separated list for visual presentation"
}

For the hobbies section:
- Keep it as a comma-separated list (e.g., "Reading, Music, Travel")
- Use concise but descriptive terms
- Maintain the original interests but phrase them professionally
- Aim for 3-6 distinct hobbies that show a well-rounded personality

Keep the core information intact but improve the language, structure, and presentation. Do not add fictional details.`
        },
        {
          role: "user",
          content: JSON.stringify({
            bio: data.bio,
            projects: data.projects,
            hobbies: data.hobbies
          })
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    // Make the API request
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to process portfolio data");
    }

    const result = await response.json();

    // Log the raw response for debugging
    console.log("Raw LLM response:", result.choices[0].message.content);

    let enhancedData: PortfolioData;

    try {
      // Parse the LLM response
      const llmResponse = JSON.parse(result.choices[0].message.content);
      console.log("Parsed LLM response:", llmResponse);

      // Check if the response has the expected structure
      if (typeof llmResponse !== 'object' || llmResponse === null) {
        console.error("Invalid LLM response format - not an object:", llmResponse);
        enhancedData = fallbackProcessing(data);
      } else {
        // Create enhanced portfolio data
        enhancedData = {
          ...data,
          bio: llmResponse.bio || data.bio,
          projects: Array.isArray(llmResponse.projects) ? llmResponse.projects : data.projects,
          hobbies: llmResponse.hobbies || data.hobbies
        };

        // Log the enhanced data for debugging
        console.log("Enhanced data:", enhancedData);
      }
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      console.log("Failed to parse content:", result.choices[0].message.content);

      // Try to extract content directly if JSON parsing fails
      try {
        const content = result.choices[0].message.content;

        // If the response contains bio or project information but isn't valid JSON,
        // try to extract it using a more lenient approach
        if (content.includes("bio") || content.includes("projects")) {
          // Simple extraction for bio if present
          const bioMatch = content.match(/"bio"\s*:\s*"([^"]*)"/);
          const enhancedBio = bioMatch ? bioMatch[1] : data.bio;

          enhancedData = {
            ...data,
            bio: enhancedBio
          };
        } else {
          enhancedData = fallbackProcessing(data);
        }
      } catch (extractError) {
        console.error("Error extracting content from LLM response:", extractError);
        enhancedData = fallbackProcessing(data);
      }
    }

    return enhancedData;
  } catch (error) {
    // Handle errors
    console.error("Error processing portfolio with Groq:", error);
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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const isSet = !!apiKey && apiKey !== 'your_groq_api_key_here';
  console.log("API key is set:", isSet);
  return isSet;
};
