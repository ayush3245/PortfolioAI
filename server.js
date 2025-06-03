// Simple server to handle API calls
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// API endpoint
app.post('/api/enhance-portfolio', async (req, res) => {
  try {
    const { bio, projects, hobbies } = req.body;

    console.log('Received request to enhance portfolio');
    console.log('Bio length:', bio?.length || 0);
    console.log('Projects count:', projects?.length || 0);

    // Get API key from environment variables
    const apiKey = process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error('API key not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    console.log('API key found, making request to Groq API');

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
      max_tokens: 2048,
    };

    // Make the API request to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || 'Failed to process portfolio data'
      });
    }

    const result = await response.json();
    console.log('Received response from Groq API');

    // Get the LLM response text
    const llmResponseText = result.choices[0].message.content;

    // Log the raw LLM response for debugging
    console.log('Raw LLM response:', llmResponseText);

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

      // Check if JSON is incomplete and try to fix it
      console.log('JSON ends with:', JSON.stringify(jsonStr.slice(-20)));
      console.log('JSON length:', jsonStr.length);

      // Check if JSON is incomplete - either doesn't end with } or has unmatched brackets/braces
      const openBraces = (jsonStr.match(/{/g) || []).length;
      const closeBraces = (jsonStr.match(/}/g) || []).length;
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;

      if (!jsonStr.endsWith('}') || openBraces !== closeBraces || openBrackets !== closeBrackets) {
        console.log('JSON appears incomplete, attempting to fix...');

        // If the string ends with an incomplete string value, close it
        if (!jsonStr.endsWith('"') && !jsonStr.endsWith(',') && !jsonStr.endsWith('}')) {
          jsonStr += '"';
        }

        // Close any open arrays first
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
          jsonStr += ']';
        }

        // Then close any open objects
        for (let i = 0; i < openBraces - closeBraces; i++) {
          jsonStr += '}';
        }

        console.log('Fixed JSON string:', jsonStr);
      }

      console.log('Final JSON string to parse:', jsonStr);
      const llmResponse = JSON.parse(jsonStr);
      console.log('Successfully parsed Groq response');

      // Return the enhanced data
      return res.json({
        success: true,
        data: {
          enhancedBio: llmResponse.bio || bio,
          enhancedProjects: Array.isArray(llmResponse.projects) ? llmResponse.projects : projects,
          enhancedHobbies: llmResponse.hobbies || hobbies
        }
      });
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);

      return res.status(500).json({
        success: false,
        error: 'Failed to parse the AI response'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
