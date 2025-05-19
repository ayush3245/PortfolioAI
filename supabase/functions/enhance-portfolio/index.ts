
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the Groq API key from environment variables
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { bio, projects, hobbies } = await req.json();

    console.log("Edge function received request with API key present:", !!GROQ_API_KEY);

    if (!GROQ_API_KEY) {
      console.error("Groq API key not found in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Groq API key not configured in Supabase secrets",
          originalData: { bio, projects, hobbies }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    // Log the payload for debugging
    console.log("Sending to Groq API:", { 
      bioLength: bio?.length || 0, 
      projectsCount: projects?.length || 0 
    });

    // Prepare the request payload for Groq
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
            bio: bio || "",
            projects: projects || [],
            hobbies: hobbies || ""
          })
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    console.log("Making API call to Groq");

    // Make the API request to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorData.error?.message || "Failed to process portfolio data",
          originalData: { bio, projects, hobbies }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status 
        }
      );
    }

    const result = await response.json();
    console.log("Received response from Groq API");

    // Parse the LLM response
    try {
      const llmResponse = JSON.parse(result.choices[0].message.content);
      console.log("Successfully parsed Groq response");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            enhancedBio: llmResponse.bio || bio,
            enhancedProjects: llmResponse.projects || projects,
            enhancedHobbies: llmResponse.hobbies || hobbies
          }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      
      // Return the original data if parsing fails
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to parse LLM response",
          originalData: { bio, projects, hobbies }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
  } catch (error) {
    // Handle any other errors
    console.error("Error in enhance-portfolio function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
