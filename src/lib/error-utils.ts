import { toast } from "@/components/ui/use-toast";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Handle API errors and show appropriate toast notifications
 * @param error Error object
 * @param fallbackMessage Default message to show if error is not an instance of Error
 */
export const handleApiError = (error: unknown, fallbackMessage = "An unexpected error occurred"): void => {
  console.error("API Error:", error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof ApiError) {
    errorMessage = error.message;
    // Handle specific status codes
    if (error.status === 401) {
      errorMessage = "Authentication failed. Please check your API key.";
    } else if (error.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
    duration: 5000,
  });
};

/**
 * Safely parse JSON with error handling
 * @param jsonString JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed JSON or fallback value
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return fallback;
  }
};
