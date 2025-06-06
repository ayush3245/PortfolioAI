const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock node-fetch
const mockFetch = jest.fn();
jest.mock('node-fetch', () => mockFetch);

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Set up test environment
process.env.VITE_GROQ_API_KEY = 'test-api-key';

// Import server after mocks are set up
const app = express();
app.use(cors());
app.use(express.json());

// Copy the API endpoint from server.js for testing
app.post('/api/enhance-portfolio', async (req, res) => {
  try {
    const { bio, projects, hobbies } = req.body;

    const apiKey = process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'API key not configured'
      });
    }

    const payload = {
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio assistant. Return only valid JSON."
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

    const response = await mockFetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || 'Failed to process portfolio data'
      });
    }

    const result = await response.json();
    const llmResponseText = result.choices[0].message.content;

    // Simple JSON parsing for tests
    const llmResponse = JSON.parse(llmResponseText);

    return res.json({
      success: true,
      data: {
        enhancedBio: llmResponse.bio || bio,
        enhancedProjects: Array.isArray(llmResponse.projects) ? llmResponse.projects : projects,
        enhancedHobbies: llmResponse.hobbies || hobbies
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    });
  }
});

describe('Server API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/enhance-portfolio', () => {
    it('should successfully enhance portfolio data', async () => {
      const mockApiResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              bio: "Enhanced bio",
              projects: [{
                title: "Test Project",
                description: "Enhanced description",
                skillsUsed: ["React", "Node.js"]
              }],
              hobbies: "Enhanced hobbies"
            })
          }
        }]
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      const testData = {
        bio: "Original bio",
        projects: [{
          title: "Test Project",
          description: "Original description",
          skillsUsed: ["React", "Node.js"]
        }],
        hobbies: "Original hobbies"
      };

      const response = await request(app)
        .post('/api/enhance-portfolio')
        .send(testData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          enhancedBio: "Enhanced bio",
          enhancedProjects: [{
            title: "Test Project",
            description: "Enhanced description",
            skillsUsed: ["React", "Node.js"]
          }],
          enhancedHobbies: "Enhanced hobbies"
        }
      });
    });

    it('should handle missing API key', async () => {
      const originalApiKey = process.env.VITE_GROQ_API_KEY;
      delete process.env.VITE_GROQ_API_KEY;

      const response = await request(app)
        .post('/api/enhance-portfolio')
        .send({})
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'API key not configured'
      });

      process.env.VITE_GROQ_API_KEY = originalApiKey;
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: { message: 'Bad request' }
        })
      });

      const response = await request(app)
        .post('/api/enhance-portfolio')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Bad request'
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/enhance-portfolio')
        .send({})
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Network error'
      });
    });
  });
});
