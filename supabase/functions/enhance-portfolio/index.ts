
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
    console.log("Request data:", { bioLength: bio?.length || 0, projectsCount: projects?.length || 0 });

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

I NEED YOUR OUTPUT IN VALID JSON FORMAT. The format should be EXACTLY as follows:
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

NO EXPLANATIONS OR ADDITIONAL TEXT ARE ALLOWED IN YOUR RESPONSE. RETURN ONLY VALID JSON.`
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
    
    // Get the LLM response text
    const llmResponseText = result.choices[0].message.content;
    console.log("LLM raw response:", llmResponseText);

    // Parse the LLM response
    try {
      // Try to extract JSON from the response if it's not pure JSON
      let jsonStr = llmResponseText;
      
      // If the response contains markdown code blocks, extract the JSON
      if (llmResponseText.includes("```json")) {
        const match = llmResponseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          jsonStr = match[1].trim();
        }
      } else if (llmResponseText.includes("```")) {
        // Try to extract from generic code blocks
        const match = llmResponseText.match(/```\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          jsonStr = match[1].trim();
        }
      }
      
      // Remove any non-JSON text before or after the JSON object
      if (jsonStr.indexOf('{') > 0) {
        jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
      }
      
      if (jsonStr.lastIndexOf('}') < jsonStr.length - 1) {
        jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);
      }
      
      console.log("Attempting to parse JSON:", jsonStr);
      const llmResponse = JSON.parse(jsonStr);
      console.log("Successfully parsed Groq response");
      
      // Ensure the response has the expected structure
      const enhancedBio = llmResponse.bio || bio;
      const enhancedProjects = Array.isArray(llmResponse.projects) ? llmResponse.projects : projects;
      const enhancedHobbies = llmResponse.hobbies || hobbies;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            enhancedBio,
            enhancedProjects,
            enhancedHobbies
          }
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      console.log("Failed to parse response. Raw content:", llmResponseText);
      
      // Attempt to manually extract content if JSON parsing failed
      try {
        // Basic extraction of bio, projects and hobbies using regex
        const manuallyExtractedData = {
          bio: bio,
          projects: projects,
          hobbies: hobbies
        };
        
        // Try to extract bio from text response
        const bioMatch = llmResponseText.match(/(?:"bio"|bio)(?:\s*:\s*)"([^"]+)"/);
        if (bioMatch && bioMatch[1]) {
          manuallyExtractedData.bio = bioMatch[1];
        }
        
        // Return the original data with any parts we could extract
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              enhancedBio: manuallyExtractedData.bio,
              enhancedProjects: manuallyExtractedData.projects,
              enhancedHobbies: manuallyExtractedData.hobbies,
            },
            warning: "Response parsing failed, using partially extracted or original data"
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      } catch (e) {
        // If even the manual extraction fails, return original data
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: {
              enhancedBio: bio,
              enhancedProjects: projects,
              enhancedHobbies: hobbies
            },
            warning: "Response parsing failed, using original data"
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      }
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
